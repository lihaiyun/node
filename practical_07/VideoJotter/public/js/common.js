function ensureOneCheck(checkBoxName, messageId, submitId) {
    const checkBoxes = $('[name=' + checkBoxName + ']');
    let checkCount = 0;
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked)
            checkCount++;
    }
    if (checkCount === 0) {
        $('#' + messageId).show();
        $('#' + submitId).prop('disabled', true);
        return false;
    } else {
        $('#' + messageId).hide();
        $('#' + submitId).prop('disabled', false);
        return true;
    }
}

function initialiseTitle() {
    let title = $('#title').val();
    let titleArr = [];
    let initTitle = '';
    if (title) {
        titleArr = title.trim().split(' ');
        for (let i = 0; i < titleArr.length; i++) {
            initTitle += titleArr[i].charAt(0).toUpperCase() + titleArr[i].slice(1)
                + (i == titleArr.length - 1 ? '' : ' ');
        }
        $('#title').val(initTitle);
    }
}