var Gaffa = require('gaffa');

function Longpoll(){}
Longpoll = Gaffa.createSpec(Longpoll, Gaffa.Behaviour);
Longpoll.prototype.type = 'longpoll';
Longpoll.prototype.url = new Gaffa.Property();
Longpoll.prototype.source = new Gaffa.Property();
Longpoll.prototype.target = new Gaffa.Property();
Longpoll.prototype.repoll = new Gaffa.Property();
Longpoll.prototype.cleans = new Gaffa.Property({
    value: true
});
Longpoll.prototype.condition = new Gaffa.Property(function(behaviour){
    var gaffa = behaviour.gaffa,
        aborted;

    if(behaviour.currentRequest){
        aborted = true;
        behaviour.currentRequest.abort();
        behaviour.currentRequest = null;
    }

    function poll(){
        if(!behaviour.condition.value){
            return;
        }

        behaviour.currentRequest = gaffa.ajax({
            url: behaviour.url.value,
            type: behaviour.method.value,
            data: behaviour.source.value,
            dataType: behaviour.dataType.value,
            success: function(data){
                behaviour.target.set(data, !behaviour.cleans.value);

                var scope = {
                    data: data
                };

                behaviour.triggerActions('success', scope, event);
            },
            error: function(event, error){
                if(behaviour.repoll.get({
                    status: event.target.status,
                    error: error
                })){
                    poll();
                    return;
                }

                gaffa.actions.trigger(behaviour.actions.error, behaviour, null, event);
            },
            complete: function(data){
                if(aborted){
                    return;
                }

                var scope = {
                    status: event.target.status,
                    data: data
                };

                gaffa.actions.trigger(behaviour.actions.complete, behaviour, scope, event);

                if(behaviour.repoll.get(scope)){
                    poll();
                }
            }
        });
    }

    poll();
});
Longpoll.prototype.dataType = new Gaffa.Property({
    value: 'json'
});
Longpoll.prototype.method = new Gaffa.Property({
    value: 'GET'
});
Longpoll.prototype.bind = function(){};

module.exports = Longpoll;