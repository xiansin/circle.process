/*!
 * circle.process v0.0.1
 * https://github.com/xiansin/circle.process
 *
 * Copyright (c) 2014-2017 Zhou Jianjia
 * Released under the MIT license
 *
 * Date: 2017-12-19
 */
var CircleProcess = (function (window) {
    // 版本
    var version = "0.0.1";
    // 当前圆弧角度
    var angle = 180;
    // 圆弧角度倍数
    var cMultiple = 180;
    // 终点远点倍数
    var sMultiple = 180;
    // 全局配置
    var option;
    // 背景圆弧配置
    var backgroundCircle;
    // 递进圆弧配置
    var percentCircle;
    // 开始远点配置
    var startSmallCircle;
    // 结束远点配置
    var endSmallCircle;
    // 梯度颜色配置
    var gradient;
    // 文字配置
    var processText;

    var CircleProcess = function (selector) {
        return new CircleProcess.fn.init(selector);
    };
    CircleProcess.fn = CircleProcess.prototype = {
        circleProcess: version,
        context: null,
        option: {},
        interVal: 0,
        constructor: CircleProcess,
        init: function (selector) {
            // 如果没有传递实体对象 抛出异常
            if (typeof selector === "undefined") {
                throw new Error("Unable to get canvas object");
            }
            // 获取canvas对象
            this.context = selector.getContext("2d");
            // 获取配置
            this.option = this._option();
            // 根据canvas获取初始配置
            this._getCanvasOption(selector);
            // 获取全局配置
            this._getOption();
            // 执行体
            this.process = function () {
                this.interVal = setInterval(function () {
                    this.run();
                }.bind(this), 20);
            };
            // 设置配置
            this.setOption = function (option) {
                this._setOption(option);
                this._getOption();
            }
        },

        /**
         *  执行
         */
        run: function () {
            var process = option.process;
            if (option.percent > 100 || option.percent < 0) {
                clearInterval(this.interVal);
                alert("Percentage out of range,The correct range of 1 - 100");
                throw new Error("Percentage out of range,The correct range of 1 - 100");
            }
            if (process >= option.percent) {
                process = option.percent;
                clearInterval(this.interVal);
            }
            this._clear();
            // 设置背景圆是否显示
            if (backgroundCircle.show) {
                this._backgroundCircle();
            }
            // 设置梯度是否显示
            if (percentCircle.show) {
                this._circleGradient(process);
            }
            // 设置起始圆点是否显示
            if (startSmallCircle.show) {
                this._smallCircle(startSmallCircle.radius, '#06a8f3', 0);
            }
            // 设置截止圆点是否显示
            if (endSmallCircle.show) {
                this._smallCircle(endSmallCircle.radius, '#00f8bb', process);
            }
            // 设置文字是否显示
            if (processText.show) {
                this._showProcess(process);
            }
            this._speed(option.percentCircle.speed);
        },
        /**
         * 清除上一次画板
         * @private
         */
        _clear: function () {
            this.context.clearRect(0, 0, backgroundCircle.roundX * 2, backgroundCircle.roundY * 2);
        },
        /**
         * 背景圆环
         * @private
         */
        _backgroundCircle: function () {
            // 设置线宽
            this.context.lineWidth = option.lineWidth;
            this.context.beginPath();
            // 绘制圆环
            this.context.arc(backgroundCircle.roundX,
                backgroundCircle.roundY,
                option.radius,
                backgroundCircle.startAngle,
                backgroundCircle.endAngle
            );
            this.context.strokeStyle = backgroundCircle.color;
            this.context.stroke();
            this.context.closePath();
        },
        /**
         * 前置圆环
         *
         * @param {int|float} process
         * @private
         */
        _circleGradient: function (process) {
            this.context.beginPath();
            this.context.lineWidth = option.lineWidth;

            this.context.arc(backgroundCircle.roundX,
                backgroundCircle.roundY,
                option.radius,
                backgroundCircle.startAngle,
                backgroundCircle.startAngle + process / 100 * cMultiple, // Math.PI * 180 / 180 * 2
                false
            );
            if (percentCircle.gradientColorShow) {
                this.context.strokeStyle = this._linearGradient();
            } else {
                this.context.strokeStyle = percentCircle.color;
            }
            this.context.lineCap = 'round';
            this.context.stroke();
            this.context.closePath();
        },
        /**
         * 梯度颜色
         *
         * @returns {CanvasGradient}
         * @private
         */
        _linearGradient: function () {
            // createLinearGradient x起点, y起点, x终点, y终点
            var xStart = backgroundCircle.roundX - option.radius - this.option.lineWidth;
            var xEnd = backgroundCircle.roundX + option.radius + this.option.lineWidth;
            var yStart = backgroundCircle.roundY;
            var yEnd = backgroundCircle.roundY;

            var linGrad = this.context.createLinearGradient(xStart, yStart, xEnd, yEnd);

            linGrad.addColorStop(0.0, 'rgba(255,0,0,0.2)');
            linGrad.addColorStop(0.2, 'rgba(255,0,0,0.4)');
            linGrad.addColorStop(0.4, 'rgba(255,0,0,0.6)');
            linGrad.addColorStop(0.6, 'rgba(255,0,0,0.7)');
            linGrad.addColorStop(0.8, 'rgba(255,0,0,0.9)');
            linGrad.addColorStop(1.0, 'rgba(255,0,0,1)');

            return linGrad;
        },

        /**
         * 开始|结束圆点
         * @param {int|float} radius
         * @param {int|float} process
         * @param {string} color
         * @private
         */
        _smallCircle: function (radius, color, process) {

            var cx = Math.cos(2 * Math.PI / 360 * (angle + process * sMultiple / 100)) * option.radius + backgroundCircle.roundX;
            var cy = Math.sin(2 * Math.PI / 360 * (angle + process * sMultiple / 100)) * option.radius + backgroundCircle.roundY;
            this.context.beginPath();
            this.context.arc(cx, cy, radius, 0, Math.PI * 2);
            this.context.lineWidth = 1;
            this.context.fillStyle = color;
            this.context.fill();
        },
        /**
         * 显示文字进度
         * @param {int} process
         * @private
         */
        _showProcess: function (process) {
            var decimal = 0;
            var num = option.percent.toString();
            // 如果当前数字是小数，那么需要保留小数 最大两位
            if (/\./.test(num) && num.split(".")[1].length > 0) {
                decimal = num.split(".")[1].length < 2 ? 1 : 2;
            }
            this.context.font = processText.fontSize + 'px April';
            this.context.textAlign = processText.textAlign;
            this.context.textBaseline = processText.textBaseline;
            this.context.fillStyle = processText.color;
            this.context.fillText(parseFloat(process).toFixed(decimal) + '%', backgroundCircle.roundX, backgroundCircle.roundY);
        },
        _showProcessFollow:function () {

        },
        /**
         * 梯度速度
         *
         * @param mode
         * @private
         */
        _speed: function (mode) {
            var option = this.option;
            if (mode === "gradient") {
                if (option.process / option.percent > 0.90) {
                    option.process += 0.30;
                } else if (option.process / option.percent > 0.80) {
                    this.option.process += 0.55;
                } else if (option.process / option.percent > 0.70) {
                    option.process += 0.75;
                } else {
                    option.process += 1.0;
                }
            } else if (mode === "normal") {
                option.process += 1.0;
            } else if (mode === "fast") {
                option.process += 2.5;
            }

        },
        /**
         * 初始化时获取canvas对象参数
         *
         * @param {object} selector
         * @private
         */
        _getCanvasOption: function (selector) {
            this._extend(this.option, {
                "backgroundCircle": {
                    "roundX": selector.width / 2,
                    "roundY": selector.height / 2,
                    "startAngle": Math.PI / 180 * 180,
                    "endAngle": Math.PI / 180 * 180 * 2
                }
            });
        },
        /**
         * 合并对象
         *
         * @param  {object} o
         * @param  {object} n
         * @private
         */
        _extend: function (o, n) {
            for (var p in n) {
                if (typeof n[p] === "object") {
                    this._extend(o[p], n[p]);
                } else if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p))) {
                    o[p] = n[p];
                } else if (n.hasOwnProperty(p) && o.hasOwnProperty(p)) {
                    o[p] = n[p];
                }
            }
        },
        /**
         *
         * @returns {*}
         * @private
         */
        _getOption: function () {
            option = this.option;
            backgroundCircle = option.backgroundCircle;
            percentCircle = option.percentCircle;
            startSmallCircle = option.startSmallCircle;
            endSmallCircle = option.endSmallCircle;
            gradient = option.gradient;
            processText = option.processText;
            cMultiple = backgroundCircle.startAngle;
            if (option.size === "complete") {
                angle = 540;
                cMultiple = backgroundCircle.startAngle * 2;
                sMultiple = 360;
                this._extend(this.option, {
                    "backgroundCircle": {
                        "startAngle": Math.PI / 180 * 120,
                        "endAngle": Math.PI / 180 * 120 * 4
                    }
                });
            } else if (option.size === "incomplete") {
                angle = 120;
                cMultiple = Math.PI * 5 / 3;
                sMultiple = 300;

                this._extend(this.option, {
                    "backgroundCircle": {
                        "startAngle": Math.PI / 180 * 120,
                        "endAngle": Math.PI / 180 * 420
                    }
                });
            }
        },
        _setOption: function (option) {
            this._extend(this.option, option);
        },
        /**
         * 初始参数配置
         *
         * @returns {{size: string, lineWidth: number, radius: number, position: string, percent: number, process: number, backgroundCircle: {show: boolean, color: string, roundX: number, roundY: number, startAngle: number, endAngle: number}, percentCircle: {show: boolean, color: string, speed: string}, startSmallCircle: {show: boolean, color: string, radius: number}, endSmallCircle: {show: boolean, color: string, radius: number}, gradient: {color: string}, processText: {show: boolean, fontSize: number, color: string, follow: boolean, textAlign: string, textBaseline: string}}}
         * @private
         */
        _option: function () {
            return {
                "size": "half", //complete,half,incomplete or todo-percent
                "lineWidth": 5,
                "radius": 100,
                "percent": 80,
                "process": 0.00,
                "backgroundCircle": {
                    "show": true,
                    "color": "#eee",
                    "roundX": 0,
                    "roundY": 0,
                    "startAngle": 0,
                    "endAngle": 0
                },
                "percentCircle": {
                    "show": true,
                    "color": "#f00",
                    "speed": "gradient",//gradient normal fast
                    "gradientColorShow": false,
                    "gradientColor": "rgba(255.0.0,0.1)"
                },
                "startSmallCircle": {
                    "show": true,
                    "color": "#06a8f3",
                    "radius": 5
                },
                "endSmallCircle": {
                    "show": true,
                    "color": "#00f8bb",
                    "radius": 5
                },
                "gradient": {
                    "color": "rgba(255,0,0,0.1)",// todo 梯度颜色
                    "size": 4
                },
                "processText": {
                    "show": true,
                    "fontSize": 20,
                    "color": "#ccc",
                    "follow": false,//todo 是否跟随渐变而改变颜色
                    "textAlign": "center",
                    "textBaseline": "alphabetic"
                }
            };
        }

    };

    CircleProcess.fn.init.prototype = CircleProcess.fn;

    return CircleProcess;
})();
