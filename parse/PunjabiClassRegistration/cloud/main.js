Parse.Cloud.afterSave("Student", function(request) {
    var name = request.object.get("name");

    var to = request.object.get("primaryEmail");
    sendEmail(to, name);

    to = request.object.get("secondaryEmail");
    if (to != '') {
        sendEmail(to, name);
    }
});

function sendEmail(to, name) {
    console.log("Sending email to " + to);

    var sendgrid = require("sendgrid");
    sendgrid.initialize("gsingh93", "sN&xxcEGT6OK");
    sendgrid.sendEmail({
        to: to,
        from: "pclass_registration@michigangurudwara.com",
        subject: "Registration confirmation",
        text: "This email confirms that " + name + " has been successfully registered for Punjabi Class.\n\nPlease do not respond to this email."
    }).then(function(httpResponse) {
        console.log("Email sent successfully");
    },function(httpResponse) {
        console.error(httpResponse);
    });
}

Parse.Cloud.job("summaryEmail", function(request, status) {
    Parse.Config.get().then(function(config) {
        var send_summary = config.get("send_summary");
        var owner_email = config.get("owner_email");

        sendSummaryEmail(send_summary, owner_email, status);
    }, function(error) {
        status.message('Retrieving config failed, falling back to cached config.');
        var config = Parse.Config.current();
        var send_summary = config.get("send_summary");
        var owner_email = config.get("owner_email");

        sendSummaryEmail(send_summary, owner_email, status);
    });
});

function sendSummaryEmail(send_summary, owner_email, status) {
    if (send_summary) {
        status.message("Sending summary email to " + owner_email);
    } else {
        status.success("Summary email disabled, not sending email");
        return;
    }

    getNumRegistrations(function(total_results, recent_results) {
        if (recent_results == 0) {
            status.success("No recent results, skipping email");
            return;
        }
        var sendgrid = require("sendgrid");
        sendgrid.initialize("gsingh93", "sN&xxcEGT6OK");
        sendgrid.sendEmail({
            to: owner_email,
            from: "pclass_registration@michigangurudwara.com",
            subject: "Registration summary",
            text: recent_results + " registrations have been received in the last 24 hours, and "
                + total_results + " registrations have been received total."
        }).then(function(httpResponse) {
            status.success("Email sent successfully");
        },function(httpResponse) {
            status.error(httpResponse);
        });
    });
}

function getNumRegistrations(callback) {
    var Student = Parse.Object.extend("Student");
    var query = new Parse.Query(Student);
    query.count({
        success: function(total_results) {
            var now = new Date();
            var day = 1 * 24 * 60 * 60 * 1000;
            var yesterday = new Date(now.getTime() - day);
            query.greaterThanOrEqualTo("createdAt", yesterday);
            query.count({
                success: function(recent_results) {
                    callback(total_results, recent_results);
                },
                error: logError
            });
        },
        error: logError
    });
}

function logError(error) {
    console.log('Error: (' + error.code + ') ' + error.message);
}
