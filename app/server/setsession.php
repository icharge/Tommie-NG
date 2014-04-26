<?php
	session_start();
	$_SESSION["user"] = "Abc";
	echo "Session set.";
	