var logger;
const log4js = require( "log4js" );
module.exports={
    DEFAULT_TIMEOUT:60000,
    LONG_WAIT_TIMEOUT:180000,
    SHORT_WAIT_TIMEOUT:10000,
    SMALL_WAIT_TIME:5000,
    LOCATOR_DELIM:"::==>",
    REPORT_PATH:'./reports/',
    SCREENSHOT_PATH:"./reports/screenshots/",
    TEST_DATA_PATH:'./test_data/',
    getLogger:function(){
        if(logger===undefined){
            log4js.configure( {
                appenders: 
                { 
                    test: { type: 'file', 
                        filename: './reports/test.log',
                        maxLogSize: 20480,
                        backups: 10 },
                    stdout:{type:'stdout',
                        maxLogSize: 20480,
                        backups: 10},
                    stderr:{type:'stderr'} 
                    },
                    categories: { default: { appenders: ['test','stdout','stderr'], level: 'all' } }
                } 
            );
            logger = log4js.getLogger( "test" );
        }
        //var logger = log4js.getLogger( "test-file-appender" );
        return logger;
    },
    KEYS:{
        BACK_SPACE:'\uE003',
        TAB:'\uE004',
        CLEAR:'\uE005',
        RETURN:'\uE006',
        ENTER:'\uE007',
        SHIFT:'\uE008',
        CONTROL:'\uE009',
        ALT:'\uE00A',
        PAUSE:'\uE00B',
        ESCAPE:'\uE00C',
        SPACE:'\uE00D',
        PAGE_UP:'\uE00E',
        PAGE_DOWN:'\uE00F',
        END:'\uE010',
        HOME:'\uE011',
        ARROW_LEFT:'\uE012',
        LEFT:'\uE012',
        ARROW_UP:'\uE013',
        UP:'\uE013',
        ARROW_RIGHT:'\uE014',
        RIGHT:'\uE014',
        ARROW_DOWN:'\uE015',
        DOWN:'\uE015',
        INSERT:'\uE016',
        DELETE:'\uE017',
        // function keys
        F1:'\uE031',  
        F2:'\uE032',
        F3:'\uE033',
        F4:'\uE034',
        F5:'\uE035',
        F6:'\uE036',
        F7:'\uE037',
        F8:'\uE038',
        F9:'\uE039',
        F10:'\uE03A',
        F11:'\uE03B',
        F12:'\uE03C'
    }
};

