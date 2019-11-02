apiready = function() {
    render();

    tap($('.avatar'), function (){
        changeAvatar();
    });

    api.getCacheSize(function(ret) {
        var size = (ret.size / 1024 / 1024).toFixed(2);
        $('#cache-size').html(parseFloat(size) + 'M');
    });

    tap($('#clear-cache'), function (){
        api.clearCache(function() {
            $('#cache-size').html('0M');
            toast('缓存清除成功');
        });
    })

    tap($('#update'), function (){
        checkUpdate();
    });

    tap($('#logout'), function (){
        confirmMsg('确认退出登录吗？', function (){
            logout();
        });
    })
}

// 渲染视图
function render(){
    var user = getUserCache();
    $('#update span').html(api.appVersion);

    if (user && user.headPortrait) {
        strs=user.headPortrait.split("/");
        var headurl = '';
        if ('imgServer' == strs[3]) {
            headurl = user.headPortrait;
        } else {
            headurl = user.headPortrait.replace("chaolidai/", "");
        }
        $('.avatar img').attr('src', headurl);
    }

    $('#phone').html(user.phone);
}

// 修改头像
function changeAvatar(){
    api.getPicture({
        sourceType: 'album',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'base64',
        allowEdit: true,
        quality: 50,
        targetWidth: 200,
        targetWidth: 200,
        saveToPhotoAlbum: false
    }, function(ret, err){
        if (ret) {
            $('.avatar img').attr('src', ret.base64Data);
            post('user/update', { headPortrait: ret.base64Data }, function (res){
                if (res.status === 'error' || res.status === 'success') {
                    toast(res.msg);
                }
            });
        }
    });
}
