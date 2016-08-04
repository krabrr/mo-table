<?php
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
    $query = "UPDATE mo SET date = '$date', hn = '$hn', operator = '$op', df = '$df', room = '$wr', pname = '$pn' WHERE id = '$id'";
  } else if ($command == "delete") {
    $id = $_GET["id"];
    $query = "DELETE FROM mo WHERE id = '$id'";
  } else if ($command == "delete_all") {

  } else {
    die();
    echo "command not found";
  }

  if ($result = mysqli_query($conn, $query)) {
    // success
  } else {
    die();
    echo mysqli_error($conn);
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
