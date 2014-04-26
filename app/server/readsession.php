<?php
	session_start();
	if (isset($_SESSION["user"]))
		echo "Welcome " . $_SESSION["user"];
	else
		echo "Welcome guest";