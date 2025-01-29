import * as React from 'react'
import styles from './ButtonTest.module.scss'
import type { IButtonTestProps } from './IButtonTestProps'

export default class ButtonTest extends React.Component<
	IButtonTestProps,
	{ showIcon: boolean }
> {
	constructor(props: IButtonTestProps) {
		super(props)
		this.state = { showIcon: props.showIcon }
	}

	componentDidUpdate(prevProps: IButtonTestProps) {
		if (prevProps.showIcon !== this.props.showIcon) {
			this.setState({ showIcon: this.props.showIcon })
		}
	}

	public render(): React.ReactElement<IButtonTestProps> {
		const {
			buttonText,
			buttonUrl,
			buttonAlignment,
			buttonFilled,
			buttonDisabled,
			buttonFullWidth,
			buttonType,
			buttonlinkTarget,
		} = this.props

		const { showIcon } = this.state
		// const svgIcon = (
		// 	<img
		// 		width='96'
		// 		height='96'
		// 		src='https://img.icons8.com/emoji/96/middle-finger-light-skin-tone.png'
		// 		alt='middle-finger-light-skin-tone'
		// 	/>
		// )

		const handleClick = () => {
			if (buttonUrl) {
				window.open(buttonUrl, buttonlinkTarget)
			} else {
				alert('No URL provided')
			}
		}

		const alignmentClass =
			buttonAlignment === 'left'
				? styles.alignLeft
				: buttonAlignment === 'center'
				? styles.alignCenter
				: styles.alignRight

		let sizeClass = ''
		switch (buttonType) {
			case 'S':
				sizeClass = styles.smallButtonSize
				break
			case 'M':
				sizeClass = styles.mediumButtonSize
				break
			case 'L':
				sizeClass = styles.largeButtonSize
				break
			default:
				sizeClass = styles.mediumButtonSize
		}

		return (
			<section className={styles.buttonTest}>
				<div className={alignmentClass}>
					<button
						className={` ${buttonFilled ? styles.filled : ''} ${
							buttonFullWidth ? styles.fullWidth : ''
						} ${sizeClass}`}
						onClick={handleClick}
						disabled={buttonDisabled}
					>
						{buttonText || 'push me and change me'}
					</button>
					{showIcon}
				</div>
			</section>
		)
	}
}
