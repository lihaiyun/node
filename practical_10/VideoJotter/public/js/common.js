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

// Use fetch to call get route /video/omdb
function getOMdbMovie() {
    let title = $('#title').val();
    fetch(`/video/omdb?title=${title}`)
        .then(res => res.json())
        .then((data) => {
            if (data.Response === 'False') {
                $('#poster').attr('src', '/img/no-image.jpg');
                $('#OMdbErr').html('Unavailable').show();
            }
            else {
                $('#OMdbErr').hide();
                $('#poster').attr('src', data.Poster);
                $('#posterURL').val(data.Poster); // hidden input field to submit
                $('#story').val(data.Plot);
                $('#starring').val(data.Actors);
                $('#datepicker').val(moment(new Date(data.Released)).format('DD/MM/YYYY'));
            }
        })
}

// Display selected file name
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// Use fetch to call post route /video/upload
$('#posterUpload').on('change', function () {
    let formdata = new FormData();
    let image = $("#posterUpload")[0].files[0];
    formdata.append('posterUpload', image);
    fetch('/video/upload', {
        method: 'POST',
        body: formdata
    })
        .then(res => res.json())
        .then((data) => {
            $('#poster').attr('src', data.file);
            $('#posterURL').attr('value', data.file); // sets posterURL hidden field
            if (data.err) {
                $('#posterErr').show();
                $('#posterErr').text(data.err.message);
            }
            else {
                $('#posterErr').hide();
            }
        })
});