<?php

require 'vendor/autoload.php';

function send_email($to_email) {
  $from = new SendGrid\Email(null, "pclass_registration@michigangurudwara.com");
  $subject = "Registration confirmation";
  $to = new SendGrid\Email(null, $to_email);
  $content = new SendGrid\Content("text/plain", "This email confirms that $name has been successfully registered for Punjabi Class.\n\nPlease do not respond to this email.");
  $mail = new SendGrid\Mail($from, $subject, $to, $content);

  $sg = new \SendGrid($config['SENDGRID_API_KEY']);
}

if (isset($_GET['key'])) {
  $config = yaml_parse(file_get_contents('config.yaml'));

  $key = $_GET['key'];
  $url = "https://punjabi-class-registration.firebaseio.com/students/$key.json"
    ."?auth=${config['FIREBASE_SECRET']}";

  $student = json_decode(file_get_contents($url), true);
  $name = $student['name'];
  $primary_email = $student['primaryEmail'];
  $secondary_email = $student['secondaryEmail'];

  send_email($name, $primary_email);
  if ($secondary_email !== '') {
    send_email($name, $secondary_email);
  }

  $response = $sg->client->mail()->send()->post($mail);
  echo $response->statusCode()."\n";
  echo $response->headers()."\n";
  echo $response->body()."\n";
}