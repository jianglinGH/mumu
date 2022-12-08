import * as echarts from 'echarts';
const exerciseOptions = {
    title_text: '每天的运动量统计',
    series_name: "运动量",
    legend_data: ['运动量', 'Top 12'],
    backgroundColor:  "#FFFF00",			// 背景色
    series_item_nor_color: '#33CCFF',		// 小圆点颜色	
    cal_item_norm_color:  '#FFCC00',		// 小块颜色		
    title_textSt_color:  "#000000",			// title颜色
    leg_textS_color:  "#000000",			// 图例颜色
    year_textS_color:  "#000000",		    // 年份颜色
    symbolSize_fn:  function (val) {
                        return (val[1]+0.2)*10;
                    },
    tooltip:  {
        trigger: 'item',
        // formatter: '{c}'
        formatter: function(params) {
            let date = params.value[0];
            let status;
            if(params.value[1] == 0) {
                status = '未运动'
            }
            if(params.value[1] == 1) {
                status = '已运动'
            }
            return date + ' ' + status;
        }
    }
}

function commonEcOption(op, data, year) {
    var title = {
        top: 30,
        text: op.title_text,
        subtext: '',
        left: 'center',
        textStyle: {
            color: op.title_textSt_color
        }
    }
    var legend =  {
        top: '30',
        left: '10',
        data: op.legend_data,
        textStyle: {
            color: op.leg_textS_color
        }
    }
    var calendar =[{
        top: 100,
        left: 'center',
        range: [year + '-01-01', year + '-06-30'],
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        yearLabel: {
            formatter: '{start}  上半年',
            textStyle: {
                color: op.year_textS_color
            }
        },
        itemStyle: {
            normal: {
                color: op.cal_item_norm_color,
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    }, {
        top: 280,
        left: 120,
        range: [year + '-07-01', year + '-12-31'],
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        yearLabel: {
            formatter: '{start}  下半年',
            textStyle: {
                color: op.year_textS_color
            }
        },
        itemStyle: {				//itemStyle的color  每一小块的颜色
            normal: {
                color: op.cal_item_norm_color,
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    }]
    var series = [
        {
            name: op.series_name,
            type: 'scatter',
            coordinateSystem: 'calendar',
            data: data,
            symbolSize: op.symbolSize_fn,
            // symbolSize: function (val) {
            // 	return (val[1]+0.2)*10;
            // },
            itemStyle: {
                normal: {
                    color: op.series_item_nor_color
                }
            }
        },
        {
            name: op.series_name,
            type: 'scatter',
            coordinateSystem: 'calendar',
            calendarIndex: 1,
            data: data,
            symbolSize: op.symbolSize_fn,
            itemStyle: {
                normal: {
                    color: op.series_item_nor_color
                }
            }
        },
        {
            name: 'Top 12',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            calendarIndex: 1,
            data: data.sort(function (a, b) {
                return b[1] - a[1];
            }).slice(0, 12),
            symbolSize: op.symbolSize_fn,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                normal: {
                    // color: '#f4e925',
                    color: op.series_item_nor_color,
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        },
        {
            name: 'Top 12',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: data.sort(function (a, b) {
                return b[1] - a[1];
            }).slice(0, 12),
            symbolSize: op.symbolSize_fn,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                normal: {
                    // color: '#f4e925',
                    color: op.series_item_nor_color,
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
    ]
    var option = {
        backgroundColor: op.backgroundColor,
        title: title,	
        tooltip: op.tooltip,
        legend: legend,
        calendar: calendar,
        series: series
    };	
    return option;	
}

// data 数据   ["2022-11-28",0],["2022-11-29",0]， year 年份
function setExerciseCalendar(echartDom, data, year){
    const myChart = echarts.init(echartDom); 
    
    const option = commonEcOption(exerciseOptions, data, year);

    myChart.setOption(option);
    myChart.resize();

}

const sleepOptions = { 
    title_text: '每天的睡眠量统计',
    series_name: "睡眠量",
    legend_data: ['睡眠量', 'Top 12'],
    backgroundColor:  "#404a59",			// 背景色
    series_item_nor_color: '#FF6600',		// 小圆点颜色	
    cal_item_norm_color:  '#323c48',		// 小块颜色		
    title_textSt_color:  "#ffffff",			// title颜色
    leg_textS_color:  "#ffffff",			// 图例颜色
    year_textS_color:  "#ffffff",		    // 年份颜色
    symbolSize_fn: function (val) { 
        // 正常入睡时间 20:00-23:30
        let h = val[1].split(':')[0];
        let m = val[1].split(':')[1];
        let toNumber = Number(h + m);
        if(toNumber >= 2000 && toNumber <= 2330) {
            return 12;
        }else {
            return 4;
        } 
    },
    tooltip	: {
        trigger: 'item',
        formatter: function(params) { 
            return params.value[0] + ' ' + params.value[1];
        }
    }
}

// data 数据   ["2022-11-28","24:00"],["2022-11-29","24:00"], year 年份
function setSleepCalendar(echartDom, data, year){
    const myChart = echarts.init(echartDom);
    const option = commonEcOption(sleepOptions, data, year);
    myChart.setOption(option);
    myChart.resize();
}


const studyOptions = {
    title_text: '每天的学习时间统计',
    series_name: "学习时间",
    legend_data: ['学习时间', 'Top 12'],
    backgroundColor:  "#f8cbcb",			// 背景色
    series_item_nor_color: '#73d6a8',		// 小圆点颜色	
    cal_item_norm_color:  '#f8aeae',		// 小块颜色		
    title_textSt_color:  "#000000",			// title颜色
    leg_textS_color:  "#000000",			// 图例颜色
    year_textS_color:  "#000000",		    // 年份颜色
    symbolSize_fn:  function (val) {
                        return val[1]*2;
                    },
    tooltip:  {
        trigger: 'item',
        // formatter: '{c}'
        formatter: function(params) { 
            return params.value[0] + ' ' + params.value[1] + 'h';
        }
    }
}

// data 数据   ["2022-11-28",0],["2022-11-29",2]， year 年份
function setStudyCalendar(echartDom, data, year){
    const myChart = echarts.init(echartDom);
    const option = commonEcOption(studyOptions, data, year);
    myChart.setOption(option);
    myChart.resize();
} 

export {setExerciseCalendar, setSleepCalendar, setStudyCalendar}