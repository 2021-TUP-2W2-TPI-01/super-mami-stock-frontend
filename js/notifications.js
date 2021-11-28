var notificationsCount = 0;
var newNotifcationsCount = 0;
var labelNotifications = 'No tienes notificaciones';

innitNotification();

function innitNotification() {

    moment.locale('es');

    const lstNotifications = notifications().sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    const lstNewNotifications = lstNotifications.filter(notif => notif.read == false);

    notificationsCount = lstNotifications.length;
    newNotifcationsCount = lstNewNotifications.length;
    $('#notifCount').text(newNotifcationsCount);

    // llenado de notificaciones
    let notifContainer = $('#notifContainer');
    notifContainer.html("");
    notifContainer.append(`<div class="notifi__title">
                            <p id="lblNewNotif">No tienes notificaciones</p>
                        </div>`);

    labelNotifications = `Tienes ${notificationsCount} ${notificationsCount == 1 ? 'notificación' : 'notificaciones'}`

    if (notificationsCount > 0)
        $('#lblNewNotif').text(labelNotifications);

    lstNotifications.forEach(notification => {
        

        let newNotification = ` <div class="notifi__item ${ !notification.read ? 'notif-new' : ''}">
                    <div class="bg-c1 img-cir img-40">
                        <i class="zmdi zmdi-email-open"></i>
                    </div>
                    <div class="content">
                        <p>${notification.body}</p>
                        <span id="lblNotifDate" class="date">${moment(notification.date).fromNow()}</span>
                    </div>
                </div>`;


        notifContainer.append(newNotification);
    });
    
    if (newNotifcationsCount > 0)
        $('#notifCount').show();
    else
        $('#notifCount').hide();

    $('.notif-new').attr('style', 'background-color: #f1f1f1');

    setTimeout(() => {
        $('.notif-new').removeAttr('style');
    },3000);
}

function newNotification(body, date) {
    
    let lstNotifications = notifications();

    lstNotifications.push({
        body: body,
        date: date,
        read: false
    });

    setNotificationsStorage(lstNotifications);

    innitNotification();
}

$('#btnNotif').click(function(){
    const lstNotifications = notifications();

    for (var i = 0; i < lstNotifications.length; i++) {
        lstNotifications[i].read = true;
    }

    setNotificationsStorage(lstNotifications);

    innitNotification();
});