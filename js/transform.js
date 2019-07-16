(function (w) {

    /**
     * 设置读取 元素的transform属性
     * */
    w.transformCss = function(node, prop, value){

        // 如果第一次设置或者读取属性，给node添加属性
        if (node.transformData === undefined) {
            node.transformData = {};
        }


        if (arguments.length > 2) {
            // 设置属性
            // 把属性和值添加到transformData中
            node.transformData[prop] = value;

            // 遍历transformData
            var result = '';  // 控字符串
            for (var i in node.transformData) {
                switch (i) {
                    case 'translate':
                    case 'translateX':
                    case 'translateY':
                        result += i + '('+node.transformData[i]+'px) ';
                        break;
                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                        result += i + '('+node.transformData[i]+') ';
                        break;
                    case 'rotate':
                    case 'skew':
                    case 'skewX':
                    case 'skewY':
                        result += i + '('+node.transformData[i]+'deg) ';
                        break;
                }
            }

            // 设置transfrom属性值
            node.style.transform = result;


        } else {
            // 读取属性（必须是同transformCSS函数设置的）

            // 如果取不到，设置默认值
            if (node.transformData[prop] === undefined) {
                // 如果prop是 scale系列，默认值是1， 其他都是0
                if (prop === 'scale' || prop === 'scaleX' || prop === 'scaleY') {
                    var value = 1;
                } else {
                    var value = 0;
                }
            } else { // 去得到值
                var value = node.transformData[prop];
            }

            return value;
        }
    }
})(window);