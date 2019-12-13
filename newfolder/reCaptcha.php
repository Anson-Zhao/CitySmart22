<!DOCTYPE html>
<html lang="en">

 <?php // Check if form was submitted:
   if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token'])) {

       // Build POST request:
       $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
       $recaptcha_secret = '6Ld7fq8UAAAAAB3tukZhkQrvQyUNFa1Hsv0geq4X';
       $recaptcha_response = $_POST['token'];

       // Make and decode POST request:
       $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
       $recaptcha = json_decode($recaptcha);

       // Take action based on the score returned:
       if ($recaptcha -> score >= 0.5) {
           // Verified - send email
       } else {
           // Not verified - show form error
       }

   } ?>
</html>

