angular.module('app').factory('MsgService', function($http) {
    return {
        requestGetMsgNew(UserInfo) {
            return $http.get('//uwork.pp.ua/api/msg_last', UserInfo)
        },
        requestGetMsgCountAll(UserInfo) {
            return $http.get('//uwork.pp.ua/api/msg_all_count', UserInfo)
        },
        requestGetMsgAll(UserInfo) {
            return $http.get('//uwork.pp.ua/api/msg_show_all', UserInfo)
        },
        requestSendMsg(body) {
            return $http.post('//uwork.pp.ua/api/msg_send', body)
        },
        requestUniqueAuthor(body){
            return $http.get('//uwork.pp.ua/api/msg_unique_sender', body)
        },
        requestMsgDialog(body){
            return $http.get('//uwork.pp.ua/api/msg_dialog/'+body)
        },
        requestMsgLastRead(body){
            return $http.get('//uwork.pp.ua/api/msg_last_update/'+body)
        },
    }
});
