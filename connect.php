<?php
$report_file_name = "report.csv";
$report_path = "/var/www/html/mo-table/report.csv";
$log_path = "/var/www/html/mo-table/log";
$conn = mysqli_connect("www.nbaramichai.com", "nbaramichai", "momomo", "mo");
if (!$conn) {
  die();
  echo mysqli_error($conn);
}

$command = $_GET["command"];

if ($command == "get") {
  // do nothing
} else {
  if ($command == "add") {
    $date = $_GET["date"];
    $hn = $_GET["hn"];
    $op = $_GET["op"];
    $df = $_GET["df"];
    $wr = $_GET["wr"];
    $pn = $_GET["pn"];
    $query = "INSERT INTO mo (date, hn, operation, df, room, pname) VALUES ('$date', '$hn', '$op', '$df', '$wr', '$pn')";
  } else if ($command == "edit") {
    $id = $_GET["id"];
    $date = $_GET["date"];
    $hn = $_GET["hn"];
    $op = $_GET["op"];
    $df = $_GET["df"];
    $wr = $_GET["wr"];
    $pn = $_GET["pn"];
    $query = "UPDATE mo SET date = '$date', hn = '$hn', operation = '$op', df = '$df', room = '$wr', pname = '$pn' WHERE id = '$id'";
  } else if ($command == "delete") {
    $id = $_GET["id"];
    $query = "DELETE FROM mo WHERE id = '$id'";
  } else if ($command == "delete_all") {

  } else if ($command == "download") {
    $query = "SELECT * FROM mo";
    if ($result = mysqli_query($conn, $query)) {
      $content = "Date,HN,Operation,DF,Ward/Room,Patient Name\n";
      while ($row = mysqli_fetch_assoc($result)) {
        $content .= $row["date"] . ",";
        $content .= $row["hn"] . ",";
        $content .= $row["operation"] . ",";
        $content .= $row["df"] . ",";
        $content .= $row["room"] . ",";
        $content .= $row["pname"];
        $content .= "\n";
      }
      $file = fopen($report_path, "w") or die("Unable to open file");
      fwrite($file, $content);
      fclose($file);
      header("Content-type: text/plain");
      header("Content-Disposition: attachment; filename='report.csv'");
      echo $content;
    } else {
      error_log(mysqli_error($conn), 3, $log_path);
      die();
    }
    mysqli_close($conn);
    die();
  } else {
    error_log("command not found", 3, $log_path);
    die();
  }

  if ($result = mysqli_query($conn, $query)) {
    // success
  } else {
    error_log(mysqli_error($conn), 3, $log_path);
    die();
  }
}

$query = "SELECT * FROM mo";
if ($result = mysqli_query($conn, $query)) {
  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $row_data = ["id" => $row["id"], "date" => $row["date"], "hn" => $row["hn"], "op" => $row["operation"], "df" => $row["df"], "wr" => $row["room"], "pn" => $row["pname"]];
    $data[] = $row_data;
  }
  echo json_encode($data);
} else {
  die();
  echo mysqli_error($conn);
}

mysqli_close($conn);
?>
