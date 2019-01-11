$(document).ready(function(){ 
    $('login').focus();
});

$(document).on("keypress", "input", function (e)
{
    //Only do something when the user presses enter
    if (e.keyCode == 13)
    {
        var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
        console.log(this, nextElement);
        if (nextElement.length)
            nextElement.focus()
        else
            $('[tabindex="1"]').focus();
    }
});