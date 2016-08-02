<?php

if (isset($_GET['url'])) {
	header("Access-Control-Allow-Origin: *");					// CORS
	header('content-type: application/json; charset=utf-8');	// json content type
	$url = $_GET['url'];										// url querystring (I think ideally we wouldnt allow everything through this...)
	$ch = curl_init($url);										// intialize curl

	curl_setopt($ch, CURLOPT_NOBODY, true);
	// if we want to set a UA
	// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	curl_exec($ch);
	$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);			// return http code
	$data = array('status'=>$retcode);							// stick it in an array

	echo json_encode($data);									// json_encode and return the array
	// $retcode >= 400 -> not found, $retcode = 200, found.
	curl_close($ch);											// close curl
}

?>
