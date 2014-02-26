JF.M("main", (function ($) {

	var p = {}, pub = {};

	p.cfg = {
		delay: 50,
		radius: {
			tl: true, //top left
			tr: true, //top right
			br: true, //bottom right
			bl: true //bottom left
		},
		opts: {
			css3: true,
			webkit: true,
			gecko: true
		}
	};

	p.updateOpts = function () {
		p.cfg.opts.css3 = JF.g('opt_css3').checked;
		p.cfg.opts.webkit = JF.g('opt_webkit').checked;
		p.cfg.opts.gecko = JF.g('opt_gecko').checked;
	};

	p.getCode = function (option, tl_radius, tr_radius, br_radius, bl_radius) {
		var radii = [tl_radius, tr_radius, br_radius, bl_radius];

		if (!(tl_radius || tr_radius || bl_radius || br_radius)) {
			return "";
		}


		for (var i = 0; i < radii.length; i++) {
			if (radii[i] <= 0) {
				radii[i] = '0';
			} else {
				radii[i] = radii[i] + 'px';
			}
		}

		var code_short = '';

		if (radii[0] == radii[1] && radii[1] == radii[2] && radii[2] == radii[3]) {
			code_short = radii[0];
		} else if ((radii[0] == radii[2]) && (radii[1] == radii[3])) {
			code_short = radii[0] + " " + radii[1];
		} else if (radii[1] == radii[3]) {
			code_short = radii[0] + " " + radii[1] + " " + radii[2];
		} else {
			code_short = radii[0] + " " + radii[1] + " " + radii[2] + " " + radii[3];
		}

		var _style = {
			"border-top-left-radius:": radii[0],
			"border-top-right-radius:": radii[1],
			"border-bottom-right-radius: ": radii[2],
			"border-bottom-left-radius: ": radii[3],
			"border-radius: ": code_short
		};


		if (option == 'webkit') {

			_style = {
				"-webkit-border-top-left-radius: ": radii[0],
				"-webkit-border-top-right-radius: ": radii[1],
				"-webkit-border-bottom-right-radius:  ": radii[2],
				"-webkit-border-bottom-left-radius:  ": radii[3],
				"-webkit-border-radius: ": code_short
			};

		} else if (option == 'gecko') {

			_style = {
				"-moz-border-radius-topleft: ": radii[0],
				"-moz-border-radius-topright: ": radii[1],
				"-moz-border-radius-bottomright: ": radii[2],
				"-moz-border-radius-bottomleft:  ": radii[3],
				"-moz-border-radius: ": code_short
			};

		}


		var code = "",
			short = "",
			i = 0;
		for (var c in _style) {
			if (!_style[c]) {
				continue;
			}

			if (i == 4) {
				short = c + _style[c] + ";\n";
				break;
			}
			code += c + _style[c] + ";\n";

			i++;
		}

		var r = {
			full: code,
			short: short
		};

		return r;

	};

	p.updateTextarea = function () {
		p.cfg.radius.tl = parseFloat($.trim(JF.g('input_tl').value)) || 0;
		p.cfg.radius.tr = parseFloat($.trim(JF.g('input_tr').value)) || 0;
		p.cfg.radius.br = parseFloat($.trim(JF.g('input_br').value)) || 0;
		p.cfg.radius.bl = parseFloat($.trim(JF.g('input_bl').value)) || 0;

		var r = null,
			code = '',
			full1 = '',
			full2 = '',
			full3 = '';
		if (p.cfg.opts['webkit']) {
			r = p.getCode('webkit', p.cfg.radius.tl, p.cfg.radius.tr, p.cfg.radius.br, p.cfg.radius.bl);
			code += r.short;
			full1 = r.full;
		}
		if (p.cfg.opts['gecko']) {
			r = p.getCode('gecko', p.cfg.radius.tl, p.cfg.radius.tr, p.cfg.radius.br, p.cfg.radius.bl);
			code += r.short;
			full2 = r.full;
		}
		if (p.cfg.opts['css3']) {
			r = p.getCode('css3', p.cfg.radius.tl, p.cfg.radius.tr, p.cfg.radius.br, p.cfg.radius.bl);
			code += r.short;
			full3 = r.full;
		}

		code += '\n/*Full Styles:*/\n';
		code += full1 + full2 + full3;

		JF.g('code').value = code;

		p.applyRadius();

	};

	p.applyRadius = function () {


		var target = JF.g('surface');

		if (target.style.borderTopLeftRadius != 'undefined') {
			target.style.borderTopLeftRadius = p.cfg.radius.tl + 'px';
			target.style.borderTopRightRadius = p.cfg.radius.tr + 'px';
			target.style.borderBottomRightRadius = p.cfg.radius.br + 'px';
			target.style.borderBottomLeftRadius = p.cfg.radius.bl + 'px';
		}

		if (target.style.WebkitBorderTopLeftRadius != 'undefined') {
			target.style.WebkitBorderTopLeftRadius = p.cfg.radius.tl + 'px';
			target.style.WebkitBorderTopRightRadius = p.cfg.radius.tr + 'px';
			target.style.WebkitBorderBottomRightRadius = p.cfg.radius.br + 'px';
			target.style.WebkitBorderBottomLeftRadius = p.cfg.radius.bl + 'px';
		}

		if (target.style.MozBorderRadiusTopright != 'undefined') {
			target.style.MozBorderRadiusTopleft = p.cfg.radius.tl + 'px';
			target.style.MozBorderRadiusTopright = p.cfg.radius.tr + 'px';
			target.style.MozBorderRadiusBottomright = p.cfg.radius.br + 'px';
			target.style.MozBorderRadiusBottomleft = p.cfg.radius.bl + 'px';
		}
	};


	pub.init = function () {

		$("#container").on("keypress", ".input_wrapper input", function (e) {
			//number only
			if (e.keyCode >= 48 && e.keyCode <= 57) {
				return true;
			}

			return false;

		}).on("keyup", ".input_wrapper input", function (e) {

			var val = this.value;

			if (val.length === 0 || val.length === 1) {
				this.className = 'chars_1';
			} else if (val.length == 2) {
				this.className = 'chars_2';
			} else if (val.length == 3) {
				this.className = 'chars_3';
			} else if (val.length == 4) {
				this.className = 'chars_4';
			} else {
				this.className = '';
			}


			clearTimeout(p.timer);
			p.timer = setTimeout(function () {

				p.updateTextarea();

			}, p.cfg.delay);



		});

		$("#options").on("click", "input", function (e) {

			p.updateOpts();

		});



	};


	return pub;

})(jQuery));