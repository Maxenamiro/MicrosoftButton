import { IReadonlyTheme } from '@microsoft/sp-component-base'
import { Version } from '@microsoft/sp-core-library'
import {
	type IPropertyPaneConfiguration,
	PropertyPaneCheckbox,
	PropertyPaneChoiceGroup,
	PropertyPaneTextField,
	PropertyPaneToggle,
} from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'

import { PropertyFieldDropdownWithCallout } from '@pnp/spfx-property-controls'
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/common/callout/Callout'
import ButtonTest from './components/ButtonTest'
import { IButtonTestProps } from './components/IButtonTestProps'

export interface IButtonTestWebPartProps {
	buttonType: string
	buttonlinkTarget: string
	buttonFilled: boolean
	buttonDisabled: boolean
	buttonFullWidth: boolean
	buttonText: string
	buttonUrl: string
	description: string
	buttonAlignment: string
	showIcon: boolean
	iconUrl: string
}

export default class ButtonTestWebPart extends BaseClientSideWebPart<IButtonTestWebPartProps> {
	private _isDarkTheme: boolean = false
	private _environmentMessage: string = ''
	props: any

	public async onInit(): Promise<void> {
		this.properties.buttonAlignment = this.properties.buttonAlignment || 'left'

		return super.onInit()
	}

	public render(): void {
		const element: React.ReactElement<IButtonTestProps> = React.createElement(
			ButtonTest,
			{
				buttonText: this.properties.buttonText,
				buttonUrl: this.properties.buttonUrl,
				buttonFilled: this.properties.buttonFilled,
				buttonDisabled: this.properties.buttonDisabled,
				buttonFullWidth: this.properties.buttonFullWidth,
				buttonType: this.properties.buttonType,
				buttonlinkTarget: this.properties.buttonlinkTarget,
				buttonAlignment: this.properties.buttonAlignment,
				description: this.properties.description,
				isDarkTheme: this._isDarkTheme,
				environmentMessage: this._environmentMessage,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				userDisplayName: this.context.pageContext.user.displayName,
				showIcon: this.properties.showIcon || false,
				iconUrl: this.properties.iconUrl,
			}
		)

		ReactDom.render(element, this.domElement)
	}




  
	protected onPropertyPaneFieldChanged(
		propertyPath: string,
		oldValue: any,
		newValue: any
	): void {
		console.log('asdasdasd', propertyPath, oldValue, newValue)
	}







	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return
		}

		this._isDarkTheme = !!currentTheme.isInverted
		const { semanticColors } = currentTheme

		if (semanticColors) {
			this.domElement.style.setProperty(
				'--bodyText',
				semanticColors.bodyText || null
			)
			this.domElement.style.setProperty('--link', semanticColors.link || null)
			this.domElement.style.setProperty(
				'--linkHovered',
				semanticColors.linkHovered || null
			)
		}
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement)
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0')
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		const urlValidation = (value: string): string => {
			console.log('URL для перевірки:', value)

			try {
				if (!value) {
					return ''
				}

				const url = new URL(value)
				const currentHostname = window.location.hostname

				// Перевірка, чи закінчується hostname URL поточним доменом
				if (
					url.hostname !== currentHostname &&
					!url.hostname.endsWith(`.${currentHostname}`)
				) {
					return `URL must contain {comapany}tenant.sharepoint.com ${currentHostname}.`
				}

				return ''
			} catch {
				return 'Wrong URL format'
			}
		}
		return {
			pages: [
				{
					groups: [
						{
							groupFields: [
								PropertyPaneTextField('buttonText', {
									label: 'Button Text',
								}),
								PropertyPaneTextField('buttonUrl', {
									label: 'Button Link',
								}),
								PropertyFieldDropdownWithCallout('buttonType', {
									calloutTrigger: CalloutTriggers.Hover,
									key: 'dropdownInfoHeaderFieldId',
									label: 'Button Type',
									options: [
										{
											key: 'S',
											text: 'Small',
										},
										{
											key: 'M',
											text: 'Medium',
										},
										{
											key: 'L',
											text: 'Large',
										},
									],
									selectedKey: this.properties.buttonType,
								}),
								PropertyFieldDropdownWithCallout('buttonlinkTarget', {
									calloutTrigger: CalloutTriggers.Hover,
									key: 'dropdownInfoHeaderFieldId',
									label: 'Link Target',
									options: [
										{
											key: '_blank',
											text: 'Open in new window',
										},
										{
											key: '_self',
											text: 'Open in this window',
										},
									],
									selectedKey: this.properties.buttonlinkTarget,
								}),
								PropertyPaneCheckbox('buttonFilled', {
									text: 'Button Filled',
								}),
								PropertyPaneCheckbox('buttonDisabled', {
									text: 'Button Disabled',
								}),
								PropertyPaneCheckbox('buttonFullWidth', {
									text: 'Full Width',
								}),
								PropertyPaneChoiceGroup('buttonAlignment', {
									label: 'Button Alignment',
									options: [
										{
											key: 'left',
											text: 'Left',
											iconProps: { officeFabricIconFontName: 'AlignLeft' },
										},
										{
											key: 'center',
											text: 'Center',
											iconProps: { officeFabricIconFontName: 'AlignCenter' },
										},
										{
											key: 'right',
											text: 'Right',
											iconProps: { officeFabricIconFontName: 'AlignRight' },
										},
									],
								}),
								// PropertyPaneToggle('showIcon', {
								// 	label: 'Show Icon',
								// 	onText: 'Show',
								// 	offText: 'Hide',
								// 	checked: this.properties.showIcon || false,
								// }),
								PropertyPaneToggle('showIcon', {
									label: 'Show Icon',
									onText: 'Yes',
									offText: 'No',
								}),
								// Поле для URL іконки, яке показується тільки якщо showIcon = true
								...(this.properties.showIcon
									? [
											PropertyPaneTextField('iconUrl', {
												label: 'Link icon',
												description: 'Insert URL-adress of img or icon.',
												onGetErrorMessage: urlValidation, // Додаємо валідацію
											}),
									  ]
									: []),
							],
						},
					],
				},
			],
		}
	}
}
