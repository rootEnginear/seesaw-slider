const slider = document.querySelector('.slider')
const sliderKnob = document.querySelector('.slider-knob')
const sliderInput = document.querySelector('.slider > input')
const sliderLabel = document.querySelector('#sliderLabel')

let sliderCenterX
let sliderCenterY
const recalculateSliderPosition = () => {
	let sliderRect = slider.getBoundingClientRect()
	sliderCenterX = ~~(sliderRect.left + sliderRect.width / 2)
	sliderCenterY = ~~(sliderRect.top + sliderRect.height / 2)
}
recalculateSliderPosition()

let force = 0 /* a */
let velocity = 0
let g = 9.8
const timeStep = 10 /* ms */
const updateSliderValueToVelocity = () => {
	// Help needed: Pls check the physics of this one
	const sliderInputValue = +sliderInput.value
	const dt = timeStep / 1000
	velocity += force * dt // v = v_0 + a * t

	const nextValue = sliderInputValue + velocity * dt // s = s_0 + v * t

	if (nextValue < 0 || nextValue > 100) {
		velocity = 0
	}

	sliderInput.value = Math.max(Math.min(nextValue, 100), 0)
	sliderLabel.textContent = `${~~nextValue}%`
}
let positionIntervalUpdater = setInterval(updateSliderValueToVelocity, timeStep)

/* true = left knob */
let invert = false
const sliderMousedown = (e) => {
	invert = e.target.classList.contains('left')
	document.addEventListener('mousemove', lockMousemoveToSlider)
	document.documentElement.classList.add('force-grabbing')
}

const lockMousemoveToSlider = (e) => {
	let angle =
		(Math.atan2(e.clientY - sliderCenterY, e.clientX - sliderCenterX) * 180) / Math.PI -
		+invert * 180
	if (angle < -180) angle += 360 // so it does not spin back (animation) over a half turn
	slider.setAttribute('style', `--rot: ${angle}deg`)

	const mg = 10 * g
	force = mg * Math.sin((angle * Math.PI) / 180)
}

let inert = false

const releaseMousemove = () => {
	document.removeEventListener('mousemove', lockMousemoveToSlider)
	document.documentElement.classList.remove('force-grabbing')
	slider.setAttribute('style', `--rot:${0}deg`)

	force = 0
	if (!inert) {
		velocity = 0
	}
}

;[...document.querySelectorAll('#gravityChoice > label > input')].forEach((el) =>
	el.addEventListener('change', (e) => setG(e.target.value))
)

const setG = (val) => {
	g = +val * 9.8
}

document
	.querySelectorAll('.slider-knob')
	.forEach((el) => el.addEventListener('mousedown', sliderMousedown))
document.addEventListener('mouseup', releaseMousemove)

window.addEventListener('resize', recalculateSliderPosition)
