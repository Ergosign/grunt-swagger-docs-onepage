(function () {
    'use strict';

    // Send messages to the parent PhantomJS process via alert! Good times!!
    var sendMessage = function() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    };

    sendMessage('bridge.initialized');

    swaggerCompleteFunction = function () {

        sendMessage('debug','swagger-simplify');

        try{
            var $this = $(document);
            $this.find('.sandbox_header .submit').remove();
            $this.find('div[class*="content-type"] select').each(function (i, select) {
                var value = $(select).val();
                $(select).replaceWith(value);
            });
            sendMessage('debug','number of scripts before: '+$this.find('script').length);
            $this.find('script').remove();
            sendMessage('debug','number of scripts after: '+$this.find('script').length);
            $this.find('table.fullwidth').find('th:nth-child(2), td:nth-child(2)').remove();
        }catch (err){
            sendMessage('swagger-error',err.message);
        }



        sendMessage('swagger-complete',document.location,document.getElementsByTagName('html')[0].innerHTML);
    };
}());
