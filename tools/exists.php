<?php

if (isset($_GET['url'])) {
	header("Access-Control-Allow-Origin: *");
	header('content-type: application/json; charset=utf-8');
	$url = $_GET['url'];
	$ch = curl_init($url);

	curl_setopt($ch, CURLOPT_NOBODY, true);
	// if we want to set a UA
	// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
	curl_exec($ch);
	$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$data = array('status'=>$retcode);

	echo json_encode($data);
	// $retcode >= 400 -> not found, $retcode = 200, found.
	curl_close($ch);
}

?>
