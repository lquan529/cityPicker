/**
 * cityPicker
 * v-2.0.2
 * dataJson			[Json]						json数据，是html显示的列表数据
 * selectpattern	[Array]						用于存储的字段名和默认提示 { 字段名，默认提示 }
 * shorthand		[Boolean]					用于城市简写功能，默认是不开启(false)
 * storage			[Boolean]					存储的值是数字还是中文，默认是(true)数字
 * autoSelected     [Boolean]                   是否自动选择第一项，默认(true)
 * renderMode		[Boolean]					是模拟的还是原生的;只在type是selector才有效,默认是(true)模拟
 * keyboard         [Boolean]                   是否开启键盘操作事件，默认(false)
 * code				[Boolean]					是否输出城市区号值，默认(false)，开启就是传字段名('cityCode')
 * search           [Boolean]                   是否开启搜索功能，默认（true）
 * searchNotStr     [String]                    没有搜索到的提示语
 * streetUrl        [String]                    街道数据的地址。可以用本地地址或者用'http://passer-by.com/data_location/town/{json}.json'
 * level			[Number]					多少列  默认是一列/级 (3)
 * onInitialized	[Attachable]				组件初始化后触发的回调函数
 * onClickBefore	[Attachable]				组件点击显示列表触发的回调函数(除原生select)
 * onForbid         [Attachable]                存在class名forbid的禁止点击的回调
 * onChoiceEnd      [Attachable]                选择结束后执行的回调
 * choose-xx		[Attachable]				点击组件选项后触发的回调函数 xx(级名称/province/city/district/street)是对应的级的回调
 */

(function ($, window) {
    var $selector;
    var grade = ['province', 'city', 'district', 'street'];
    var defaults = {
        dataJson: null,
        selectpattern: [
            {
                field: 'userProvinceId',
                placeholder: '请选择省份'
            }, {
                field: 'userCityId',
                placeholder: '请选择城市'
            }, {
                field: 'userDistrictId',
                placeholder: '请选择区县'
            }, {
                field: 'userStreet',
                placeholder: '请选择街道'
            }
        ],
        shorthand: false,
        storage: true,
        autoSelected: true,
        renderMode: true,
        keyboard: false,
        code: false,
        search: true,
        searchNotStr: '查找不到{city}相关城市~',
        streetUrl: 'town/{json}.json',
        level: 3,
        onInitialized: function () {},
        onClickBefore: function () {},
        onChoiceEnd: function () {},
        onForbid: function () {}
    };

    function Citypicker(options, selector) {
        this.options = $.extend({}, defaults, options);
        this.$selector = $selector = $(selector);
        this.values = [];

        this.init();
        this.bindEvent();
    }

    //功能模块函数
    var effect = {
        montage: function (data, pid, reg) {
            var self = this,
                config = self.options,
                leng = data.length,
                html = '',
                code, name, storage;

            for (var i = 0; i < leng; i++) {
                if (data[i].parentId === pid) {
                    //判断是否要输出区号
                    code = config.code && data[i].cityCode !== '' ? 'data-code=' + data[i].cityCode : '';
                    //判断是否开启了简写，是就用输出简写，否则就输出全称
                    name = config.shorthand ? data[i].shortName : data[i].name;
                    //存储的是数字还是中文
                    storage = config.storage ? data[i].id : name;

                    if (config.renderMode) {
                        //模拟
                        html += '<li class="caller" data-id="' + data[i].id + '" data-title="' + name + '" ' + code + '>' + name + '</li>';
                    } else {
                        //原生
                        html += '<option class="caller" value="' + storage + '" data-id="' + data[i].id + '" data-title="' + name + '" ' + code + '>' + name + '</option>';
                    }
                }
            }

            return html;
        },
        seTemplet: function () {
            var config = this.options,
                selectemplet = '',
                placeholder, field, forbid, citygrade, active, hide,
                searchStr = config.search ? '<div class="selector-search">'
                    +'<input type="text" class="input-search" value="" placeholder="拼音、中文搜索" />'
                +'</div>' : '';

            for (var i = 0; i < config.level; i++) { //循环定义的级别
                placeholder = config.selectpattern[i].placeholder; //默认提示语
                field = config.selectpattern[i].field; //字段名称
                citygrade = grade[i]; //城市级别名称
                forbid = i > 0 ? 'forbid' : ''; //添加鼠标不可点击状态
                active = i < 1 ? 'active' : ''; //添加选中状态
                hide = i > 0 ? ' hide' : ''; //添加隐藏状态

                if (config.renderMode) {
                    //模拟
                    selectemplet += '<div class="selector-item storey ' + citygrade + '" data-index="' + i + '">'
                        +'<a href="javascript:;" class="selector-name reveal df-color ' + forbid + '">' + placeholder + '</a>'
                        +'<input type=hidden name="' + field + '" class="input-price val-error" value="" data-required="' + field + '">'
                        +'<div class="selector-list listing">'+ searchStr +'<ul></ul></div>'
                    +'</div>';
                } else {
                    //原生
                    selectemplet += '<select name="' + field + '" data-index="' + i + '" class="' + citygrade + '">'
                        +'<option>' + placeholder + '</option>'
                    +'</select>';
                }
            }

            return selectemplet;
        },
        obtain: function (event) {
            var self = this,
                config = self.options,
                $selector = self.$selector,
                $target = config.renderMode ? event[0].target ? $(event[0].target) : $(event) : $(event.target),
                $parent = $target.parents('.listing'),
                $selected = $target.find('.caller:selected'),
                index = config.renderMode ? $target.parents('.storey').data('index') : $target.data('index'),
                id = config.renderMode ? $target.attr('data-id') : $selected.attr('data-id'),
                name = config.renderMode ? $target.text() : $selected.text(),
                storage = config.storage ? id : name, //存储的是数字还是中文
                code = config.renderMode ? $target.data('code') : $selected.data('code'),
                $storey = $selector.find('.storey[data-index="'+ index +'"]'),
                $listing = $selector.find('.listing').eq(index + 1),
                values = { 'id': id || '0', 'name': name, 'cityCode': code || '' },
                aselectedIndex = config.autoSelected ? 1 : 0,
                placeholder = config.selectpattern[index < 3 ? index + 1 : index].placeholder,
                placeholderStr = !config.renderMode ? '<option class="caller" value="">'+placeholder+'</option>'+ effect.montage.apply(self, [config.dataJson, id]) : '<li class="caller">'+placeholder+'</li>'+ effect.montage.apply(self, [config.dataJson, id]);

            // 存储选择的值
            if (self.values.length > 0) {
                // 判断如果是values 有值，就根据选择的列去替换成新的选择值
                self.values.splice(index, config.level - 1, values);
            } else {
                // values 没有值就直接添加
                self.values.push(values);
            }
            //选择选项后触发自定义事件choose(选择)事件
            $selector.trigger('choose-' + grade[index] +'.citypicker', [$target, values]);
            //赋值给隐藏域-区号
            $selector.find('[role="code"]').val(code);
            self.cityCode = code;
            // 判断类型
            if (config.renderMode) {
                //给选中的级-添加值和文字
                $storey.find('.reveal').removeClass('df-color forbid').text(name).siblings('.input-price').val(storage);
                $listing.data('id', id).find('ul').html(placeholderStr);
                index < 2 ? $listing.find('.caller').eq(aselectedIndex).trigger('click') : '';
                $listing.find('.caller').eq(0).remove();
                // 不是自动选择的事情
                !config.autoSelected ? $selector.find('.reveal').eq(index + 1).addClass('df-color') : '';
                //模拟: 添加选中的样式
                $parent.find('.caller').removeClass('active');
                $target.addClass('active');
            } else {
                //原生: 下一级附上对应的城市选项，执行点击事件
                $target.next().html(placeholderStr).find('.caller').eq(aselectedIndex).prop('selected', true);
                index < 2 ? $target.next().trigger('change') : '';
            }
            // 开启四级联动，添加四级城市
            if (config.level === 4 && index === 2) {
                self.getStreet(id);
            }
            // 选择完后执行的回调
            if (config.level - 1  === index) {
                config.onChoiceEnd.apply(self);
            }
        },
        show: function (event) {
            var config = this.options,
                $target = $(event),
                $parent = $target.parent();
            $selector = this.$selector;

            $parent.addClass('selector-show').siblings('.selector-item').removeClass('selector-show');
            // 判断是否开启搜索，是就获取搜索框焦点
            if (config.search) {
                setTimeout(function() {
                    $parent.find('.input-search').focus();
                }, 400);
            }
            //点击的回调函数
            config.onClickBefore.call($target);
        },
        hide: function (event) {
            var config = this.options,
                $target = $(event);

            effect.obtain.call(this, $target);

            $selector.find('.selector-item').removeClass('selector-show');

            return false;
        },
        search: function (event) {
            event.preventDefault();
            var self = this,
                $target = $(event.target),
                $parent = $target.parents('.listing'),
                inputVal = $target.val(),
                id = $parent.data('id'),
                keycode = event.keyCode,
                result = [], htmls;

            //如果是按下shift/ctr/左右/command键不做事情
            if (keycode === 16 || keycode === 17 || keycode === 18 || keycode === 37 || keycode === 39 || keycode === 91 || keycode === 93) {
                return false;
            }
            //如果不是按下enter/上下键的就做搜索事情
            if (keycode !== 13 && keycode !== 38 && keycode !== 40) {
                $.each(this.options.dataJson, function(key, value) {
                    //拼音或者名称搜索
                    if(value.pinyin.toLocaleLowerCase().search(inputVal) > -1 || value.name.search(inputVal) > -1 || value.id.search(inputVal) > -1 ){
                        result.push(value);
                    }
                });
                // 搜索结果返回的html
                htmls = effect.montage.apply(self, [result, id]);
                // 插入到DOM去
                $parent.find('ul').html(htmls ? htmls : '<li>'+ self.options.searchNotStr.replace('{city}', '<strong>'+ inputVal +'</strong>') +'</li>');
            }
        },
        operation: function (event) {
            event.preventDefault();
            var $target = $(event.target),
                $sibl = $target.hasClass('input-search') ? $target.parents('.listing') : $target.siblings('.listing'),
                $items = $sibl.find('.caller'),
                inputVal = $sibl.find('.input-search').val(),
                keyCode = event.keyCode,
                index = 0,
                direction,
                itemIndex;
            
            //按下enter键
            if (keyCode === 13) {
                if (!$items.hasClass('active')) { return false; }

                effect.hide.call(this, $sibl.find('.caller.active'));
                return false;
            }
            
            //按下上下键
            if (keyCode === 38 || keyCode === 40) {

                //方向
                direction = keyCode === 38 ? -1 : 1;
                //选中的索引
                itemIndex = $items.index($sibl.find('.caller.active'));

                if (itemIndex < 0) {
                    index = direction > 0 ? -1 : 0;
                } else {
                    index = itemIndex;
                }

                //键盘去选择的索引
                index = index + direction;

                //循环选择
                index = index === $items.length ? 0 : index;

                $items.removeClass('active').eq(index).addClass('active');

                //滚动条跟随定位
                effect.position.call(this, $sibl);
            }

            return false;
        },
        position: function (event) {
            var $target = event,
                $caller = $target.find('.caller.active'),
                oh = $target.outerHeight(),
                ch = $caller.outerHeight(),
                dy = $caller.position().top,
                sy = $target.find('ul').scrollTop();

            $target.find('ul').animate({
                scrollTop: dy + ch - oh + sy
            }, 200);
        },
        evaluation: function (arr, arrayVal) {
            var self = this,
                config = self.options,
                $selector = self.$selector;

            // 清空原本的值
            self.values = [];
            // 循环拿到对应的级城市赋值
            $.each(arr, function (item, value) {
                var $original = $selector.find('.'+grade[item]);
                var $forward = $selector.find('.'+grade[item+1]);
                var name = config.shorthand ? value.shortName : value.name;
                
                // 两种方式
                if (config.renderMode) {
                    $original.find('.reveal').text(name).removeClass('df-color forbid').siblings('.input-price').val(value.id);

                    $forward.find('ul').html(effect.montage.apply(self, [config.dataJson, value.id]));
                    $original.find('.caller[data-id="'+value.id+'"]').addClass('active');
                } else {
                    $forward.html(effect.montage.apply(self, [config.dataJson, value.id]));
                    $original.find('.caller[data-id="'+value.id+'"]').prop('selected', true);
                }

                // 存储选择的值
                self.values.push({ 'id': value.id, 'name': name, 'cityCode': value.cityCode });
            });
            // 开启四级联动，取四级城市数据
            if (arr.length === 3 && config.level === 4) {
                self.getStreet(arr[2].id, true, arrayVal[3] ? arrayVal[3] : '');
            }
        }
    };

    Citypicker.prototype = {
        init: function () {
            var self = this,
                config = self.options,
                code = config.code ? '<input type="hidden" role="code" name="' + config.code + '" value="">' : '';
                //是否开启存储区号，是就加入一个隐藏域

            //添加拼接好的模板
            $selector.html(effect.seTemplet.call(self) + code);

            //html模板
            if (config.renderMode) {
                //模拟>添加数据
                $selector.find('.listing').data('id', '100000').eq(0).find('ul').html(effect.montage.apply(self, [config.dataJson, '100000']));
            } else {
                //原生>添加数据
                $selector.find('.province').append(effect.montage.apply(self, [config.dataJson, '100000']));
            }
            //初始化后的回调函数
            config.onInitialized.call(self);
        },
        bindEvent: function () {
            var self = this,
                config = self.options;

            //点击显示对应的列表
            $selector.on('click.citypicker', '.reveal', function (event) {
                event.preventDefault();
                var $this = $(this);

                if ($this.is('.forbid, .disabled')) {
                    // 禁止的回调函数
                    config.onForbid.call($this);
                    return false;
                }
                // 显示回调函数
                effect.show.call(self, $this);
                return false;
            });
            //点击选项事件
            $selector.on('click.citypicker', '.caller', $.proxy(effect.hide, self));
            //原生选择事件
            $selector.on('change.citypicker', 'select', $.proxy(effect.obtain, self));
            //文本框搜索事件
            $selector.on('keyup.citypicker', '.input-search', $.proxy(effect.search, self));
            //开启键盘操作
            if (config.keyboard) {
                //键盘选择事件
                $selector.on('keyup.citypicker', '.storey', $.proxy(effect.operation, self));
            }
        },
        unBindEvent: function (event) {
            var self = this,
                config = self.options;

            // 处理原生
            if (!config.renderMode) {
                $selector.off('change.citypicker', 'select');
                return false;
            }
            // 销毁展开列表事件
            $selector.off('click.citypicker', '.reveal');
            // 销毁选择事件
            $selector.off('click.citypicker', '.caller');
            // 销毁搜索事件
            $selector.off('keyup.citypicker', '.input-search');
            // 销毁键盘事件
            $selector.off('keyup.citypicker', '.storey');

        },
        setCityVal: function (val) {
            var self = this,
                arrayVal = val.split(/\,\s|\,/g),
                result = [], resultArray;

            // 处理传入的城市数组，然后去查找相同的名称，存储到新的数组上
            $.each(arrayVal, function (key, value) {
                // 循环数据，去拿到对应的城市名称，存储到新的数组去
                $.each(self.options.dataJson, function (item, val) {
                    var isType = isNaN(value) ? value === val.name : value === val.id;
                    if (isType) {
                        result.push(val);
                    }
                });
            });
            // 反向排序数组
            resultArray = result[0].parentId === '100000' ? result.sort() : result.reverse();
            // 设置默认值
            effect.evaluation.apply(self, [result, arrayVal]);    
        },
        getCityVal: function () {
            return this.values;
        },
        changeStatus: function (status) {
            var self = this,
                config = self.options;

            if (status === 'disabled') {
                self.$selector.find('.reveal').addClass('disabled').siblings('.input-price').prop('disabled', true);

                !config.renderMode ? self.$selector.find('select').prop('disabled', true) : '';
            } else if (status === 'current') {
                self.$selector.find('.reveal').removeClass('disabled forbid').siblings('.input-price').prop('disabled', false);

                !config.renderMode ? self.$selector.find('select').prop('disabled', false) : '';
            }
        },
        getStreet: function (id, isSet, name) {
            var self = this,
                config = self.options,
                $street= self.$selector.find('.street'),
                placeholder = config.selectpattern[3].placeholder,
                index = config.autoSelected ? 1 : 0,
                title = name && config.shorthand ? name.replace(/街道|镇|乡/g, '') : name,
                converts = isNaN(title) ? 'data-title='+ title : config.renderMode ? 'data-id='+ title : 'value="'+ title +'"',
                reults = [], placeholderStr, autoSelectedStr;

            // 没有ID值就不做以下事情
            if (!id) { return false; }
            // 取街道级数据
            $.getJSON(config.streetUrl.replace('{json}', id), function (data) {
                // 重新拼接新的数据
                $.each(data, function (key, value) {
                    reults.push({ 'id': key, 'parentId': id, 'name': value, 'shortName': value.replace(/街道|镇|乡/g, ''), 'cityCode': '' });
                });
                placeholderStr = !config.renderMode ? '<option class="caller" value="">'+placeholder+'</option>'+ effect.montage.apply(self, [reults, id]) : '<li class="caller">'+placeholder+'</li>'+ effect.montage.apply(self, [reults, id]);
                // 数据转化，然后转成html插入到DOM里去
                if (config.renderMode) {
                    $street.find('ul').html(placeholderStr);
                    // 如果是设置城市的就按照城市名称去选中，否则就选中第一项
                    if (isSet) {
                        $street.find('.caller['+ converts +']').trigger('click');
                    } else {
                        $street.find('.caller').eq(index).trigger('click');
                    }
                    $street.find('.caller').eq(0).remove();
                    !isSet & !config.autoSelected ? $street.find('.reveal').addClass('df-color') : '';
                } else {
                    $street.html(placeholderStr);
                    // 如果是设置城市的就按照城市名称去选中，否则就选中第一项
                    if (isSet) {
                        $street.find('.caller['+ converts +']').prop('selected', true);
                    } else {
                        $street.find('.caller').eq(index).prop('selected', true);
                    }
                    $street.trigger('change');
                }
            });
        }
    };

    //模拟：执行点击区域外的就隐藏列表;
	$(document).on('click.citypicker', function (event){
		if($selector && $selector.find(event.target).length < 1) {
			$selector.find('.selector-item').removeClass('selector-show');
		}
    });

    $.fn.cityPicker = function (options) {
        return new Citypicker(options, this);
    };

})(jQuery, window);