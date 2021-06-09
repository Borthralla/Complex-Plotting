
class ComplexNumber {
	constructor(real, imaginary) {
		this.real = real;
		this.imaginary = imaginary
	}

	static from_polar(arg, abs) {
		let real = Math.cos(arg) * abs
		let imaginary = Math.sin(arg) * abs
		return new ComplexNumber(real, imaginary)
	}

	arg() {
		return Math.atan2(this.imaginary, this.real)
	}

	abs() {
		return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary)
	}

	mul(z) {
		let real = this.real * z.real - this.imaginary * z.imaginary
		let imaginary = this.real * z.imaginary + z.real * this.imaginary
		return new ComplexNumber(real, imaginary)
	}

	div(z) {
		let arg = this.arg() - z.arg()
		let abs = this.abs() / z.abs()
		return ComplexNumber.from_polar(arg, abs)
	}

	add(z) {
		return new ComplexNumber(this.real + z.real, this.imaginary + z.imaginary)
	}

	sub(z) {
		return new ComplexNumber(this.real - z.real, this.imaginary - z.imaginary)
	}

	pow(r) {
		let arg = this.arg() * r
		let abs = this.abs() ** r
		return ComplexNumber.from_polar(arg, abs)
	}

	exp() {
		return ComplexNumber.from_polar(this.imaginary, Math.exp(this.real))
	}

	sin() {
		let real = Math.sin(this.real) * Math.cosh(this.imaginary)
		let im = Math.cos(this.real)*Math.sinh(this.imaginary)
		return new ComplexNumber(real, im)
	}

	color() {
		let hue = this.arg() * 180 / Math.PI
		return `hsl(${hue}, 100%, 50%)`
	}
}

// A plot has a real interval and an imaginary interval
// It also has a resolution which is the same in both directions
// So if we have a plot that goes from -10 to 10 with lets say 10 pixels per unit, that would correspond to
// A grid of 100x100 or 10000 rectangle calls
// If we say each rec is 1 pixel, then that will be 100x100 pixels which is pretty small
class Plot {
	constructor(real_start, real_length, im_start, im_length, resolution) {
		this.canvas = document.getElementById("plot")
		this.canvas.width = real_length * resolution
		this.canvas.height = im_length * resolution
		this.ctx = this.canvas.getContext("2d");
		this.real_start = real_start
		this.real_length = real_length
		this.im_start = im_start
		this.im_length = im_length
		this.resolution = resolution
	}

	plot_function(f) {
		for (let r = 0; r < this.im_length * this.resolution; r++) {
			for (let c = 0; c < this.real_length * this.resolution; c++) {
				let input_real = this.real_start + c / this.resolution
				let input_im = this.im_start + r / this.resolution
				let input = new ComplexNumber(input_real, input_im)
				let output = f(input)
				let color = output.color()
				this.ctx.fillStyle = color
				this.ctx.fillRect(c, this.im_length * this.resolution - r, 1, 1)
			}
		}
	}
}
let c = new ComplexNumber(0, 1)
let identity = (z) => z

//10x10 plot centered at origin with 10 pixels per unit
plot = new Plot(-10, 20, -10, 20, 50)
plot.plot_function(identity)

// Note that this could likely be entirely parallelized in a Webgl shader
// Just draw a square and then in the pixel shader do the calculations based off where the pixel is relative to the vertices
// Also note that the phase graph really can be optimized as taking in two real numbers and returning a real number. There are some cases where its harder to think of it that way though.