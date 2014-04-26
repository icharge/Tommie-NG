<?php
	require("../autostart.php");

	$data = json_decode(file_get_contents("php://input"));
	//$stuid = (!empty($data->uid) ? mysql_real_escape_string($data->uid) : "");
	$stuid = pintput($data->uid);
	$stuname = pinput($data->uname);
	$stupwd = pinput($data->pwd);
	$stuemail = pinput($data->email);
	//$stumajor = ($data->student-major);
	if(empty($stuid) or empty($stuname) or empty($stupwd) or empty($stuemail)) {
		$arr = array('msg' => "", 'error' => 'กรุณากรอกข้อมูลให้ครบ');
		$jsn = json_encode($arr);
		print_r($jsn);
		die();
	}

	$db->Table = "student";
	$db->Where = "Stu_name = '$stuname'";
	$checkuser = $db->Select1();

	if(!$checkuser){
		$db->Table = "student";
		$db->Field = "Stu_id, Stu_name, Stu_pwd, Stu_major, Stu_gender, Stu_email";
		$db->Value = "'$stuid', '$stuname', '$stupwd', '', '', '$stuemail'";
		$result = $db->Insert();
		if($result){
			$arr = array('msg' => "User Created Successfully!!!", 'error' => '');
			$jsn = json_encode($arr);
			print_r($jsn);
		} else {
			$arr = array('msg' => "", 'error' => 'Error In inserting record');
			$jsn = json_encode($arr);
			print_r($jsn);
		}
	} else {
		$arr = array('msg' => "", 'error' => 'Error In inserting record');
		$jsn = json_encode($arr);
		print_r($jsn);
	}
