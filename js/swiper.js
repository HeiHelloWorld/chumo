
/*
* swiper插件的用法
* swiper({
*   el: swiper的包裹元素（必选）,
*   pagination: 元素 （可选）
*   isAutoPlay: false (可选)
*   delay 5000  (可选)
* })
* */

(function (w) {
    w.swiper = function(options) {

        if (options.el === undefined) {
            console.error('el选项必须指定！');
        }

        // 输出设置的选项
        var swiper = options.el;
        var pagination = options.pagination || null;  // 放置小圆点包裹元素
        var isAutoPlay = options.isAutoPlay || false;
        var delay = options.delay || 5000;

        // 相关元素操作
        swiper.classList.add('swiper');

        // 获取相关元素
        var swiperWrapper = swiper.querySelector('.swiper-wrapper');

        var itemLength = swiper.querySelectorAll('.swiper-item').length; // swiper项目的数量
        var index = 0;  // 当前的swiper项目的索引


        // 如果指定了 小圆点包裹元素
        if (pagination) {
            // 添加类
            pagination.classList.add('pagination');

            // 生成小圆点
            for (var i = 0; i < itemLength; i ++) {
                var span = document.createElement('span');
                pagination.appendChild(span);
            }

            // 获取所有小圆点的集合
            var paginationItems = pagination.querySelectorAll('span');
        }


        // 把所有swiper项目 统统复制一份
        swiperWrapper.innerHTML += swiperWrapper.innerHTML;

        // 获取所有的swiper项目
        var swiperItems = swiper.querySelectorAll('.swiper-item');


        // 样式布局计算
        swiperWrapper.style.width = swiperItems.length * 100 + '%';
        swiperItems.forEach(function (item) {
            item.style.width = 100 / swiperItems.length + '%';
        });


        // 初始化
        setSwiper(index);

        if (isAutoPlay) {
            // 自动播放
            var timeId = setInterval(autoPlay, delay);
        }


        // 给swiperWrapper 监听过渡结束事件
        swiperWrapper.addEventListener('transitionend', function () {
            if (index >= swiperItems.length - 1) {
                index = itemLength - 1;
                swiperWrapper.style.transition = 'none';
                transformCss(swiperWrapper, 'translateX', -index * swiper.clientWidth);
            }
        });

        // 触摸开始事件
        swiper.addEventListener('touchstart', function (event) {
            // 取消过渡效果
            swiperWrapper.style.transition = 'none';

            // 判断无缝滑动的临界值
            if (index <= 0) {
                index = itemLength; // 重置给index赋值
                transformCss(swiperWrapper, 'translateX', -index * swiper.clientWidth)
            } else if (index >= swiperItems.length - 1) {
                index = itemLength - 1; // 重新个index赋值
                transformCss(swiperWrapper, 'translateX', -index * swiper.clientWidth)
            }

            var touch = event.changedTouches[0]; // 获取touch对象
            this.startX = touch.clientX;   // 获取触点的起始位置 并赋值给swiper对象的属性
            this.startY = touch.clientY;   // 记录触点垂直开始位置
            this.eleLeft = transformCss(swiperWrapper, 'translateX'); // swiperWrapper元素的初始位置
            this.startTime = (new Date).getTime();  // 记录触摸开始的时间
            this.isFirstMove = true;  // 标记是否第一次触发touchmove事件
            this.isHorizontal = true;  // 表示是否是水平滑动

            if (isAutoPlay) {
                // 暂停定时
                clearInterval(timeId);
            }
        });

        // 触摸移动事件
        swiper.addEventListener('touchmove', function (event) {

            // 如果不是水平滑动
            if (!this.isHorizontal) {
                return;
            }

            var touch = event.changedTouches[0];  // 获取touch对象
            var endX = touch.clientX; // 获取触点的结束位置
            var endY = touch.clientY; // 触点的垂直方向结束位置

            // 计算触点的间距
            this.dstX = endX - this.startX; // 把值赋值给swiper对象属性
            var dstY = endY - this.startY;  // 触点垂直方向的滑动距离


            // 如果是在touchstart之后第一次触发touchmove
            if (this.isFirstMove) {
                this.isFirstMove = false;  // 已经不是第一次了
                // 判断是水平滑动还是垂直滑动  水平距离<垂直距离 垂直滑动
                if (Math.abs(this.dstX) < Math.abs(dstY)) {
                    this.isHorizontal = false; // 不是水平滑动
                    this.dstX = 0;  // 设置水平滑距离为0
                    return;
                }
            }

            // 设置swiper-wrapper 的位置
            transformCss(swiperWrapper, 'translateX', this.eleLeft + this.dstX);

            // 阻止浏览器默认动作
            event.preventDefault();


        });

        // 触摸离开事件
        swiper.addEventListener('touchend', function (event) {
            // 设置过渡
            swiperWrapper.style.transition = '.5s';

            // 获取结束时间
            var endTime = (new Date).getTime();
            var dstTime = endTime - this.startTime;  // 计算时间差

            // 根据时间差进行判断
            if (dstTime < 300) {
                // 快速滑动
                if (this.dstX < 0) {
                    index++;
                } else if (this.dstX > 0) {
                    index--;
                }

            } else {
                // 普通速度滑动
                // 计算索引
                index = -Math.round(transformCss(swiperWrapper, 'translateX') / swiper.clientWidth);
            }

            // 调用函数设置位置以及小圆点
            setSwiper(index);

            if (isAutoPlay) {
                // 重新定时
                timeId = setInterval(autoPlay, delay);
            }
        });


        // 设置swiperWrapp的位置和小圆点高亮
        function setSwiper(m) {
            // 判断索引范围
            if (m < 0) {
                m = 0;
            } else if (m > swiperItems.length - 1) {
                m = swiperItems.length - 1;
            }

            // 设置swiperWrapper位置
            transformCss(swiperWrapper, 'translateX', -m * swiper.clientWidth);

            if (pagination) {
                // 去掉所有小圆点的 active类
                paginationItems.forEach(function (item) {
                    item.classList.remove('active');
                });

                // 当前的小圆点高亮 添加active
                paginationItems[m % itemLength].classList.add('active');
            }


            index = m; // 给全局索引重置赋值
        }

        // 自动播放韩
        function autoPlay() {
            // 设置过渡时间
            swiperWrapper.style.transition = '.5s';

            // 索引 + 1
            index++;

            // 执行变换
            setSwiper(index);
        }
    }

})(window);