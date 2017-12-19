# circle.process
使用圆环来表示渐进

### 效果：

![](https://raw.githubusercontent.com/xiansin/circle.process/master/res/GIF.gif)

### 使用方法

	// 传入 canvas 对象
	var circleProcess = CircleProcess(document.getElementById("canvas"));
	// 开始
	circleProcess.process();

### 配置项
如果有需要使用配置，可以通过 `circleProcess.setOption()`
	
	circleProcess.setOption({
        "percent": 60,
        "startSmallCircle":{
            "radius": 6
        },
        "endSmallCircle":{
            "radius": 12
        },
        "processText":{
            "color":"red"
        }
    });

	circleProcess.process();
### License
MIT © Zhou JianJia

[完整配置项](https://raw.githubusercontent.com/xiansin/circle.process/master/res/config.json "完整配置项")
