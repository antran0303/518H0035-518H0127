var id;

$(document).ready(function () {
  var cmtList = [];
  $("#btnPost").click(function () {
    // console.log("abc");
    if ($("#textareaPost").val().trim() !== "") {
      $.post(
        "/postfeed",
        { content: $("#textareaPost").val() },
        function (data) {
          $("#textareaPost").val("");

          if (data.result == 0) {
            alert("Add unsuccess");
          } else {
            // console.log(data.newFeed);
            var Name = data.user.name;
            var Image = data.user.image;
            var Comment = data.newFeed.content;
            var id = data.newFeed._id;
            // console.log(id); nghe ko o?

            // ông nghe k?ông nghe rõ k?> nghe rõ ko o? ko nghe lun hửm? r lun o out thu ben ong r vo la xem nghe ma nhỏ ông nghe tui k ko lun a nghe ong nho lamnay tui call ben nay to nay nghe k tui nghe ong
            $("#list-feed").append(`
           
           
       `)
            const div = document.createElement('div')
            div.innerHTML = `
            <div class="box1" id="`+ id +`">
              <div class="d-flex skfjkk">
                <div class="lkt40">

                  <img src="`+ Image +`" alt="">

                </div>
                <div class="container">
                  <div class="row">

                    <div class="pl-2 pt-1 col-md-3">
                      <h6>
                      `+ Name +`
                      </h6>
                    </div>

                    <div class="col-md-7"></div>

                    <div class="dropdown col-md-2 ">
                      <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i
                          class="fas fa-ellipsis-h"></i>
                        <span class="caret"></span></button>
                      <ul class="dropdown-menu">
                        <li><a href="/delete/`+ id +` ">Delete</a></li>
                        <li><button data-edit="contentModal`+ id +`"
                            onclick="clickEdit('contentModal+`+ id +`'), getId('`+ id +`')" class="edit"
                            data-toggle="modal" data-target="#exampleModalEdit">Edit</button></li>
                      </ul>
                    </div>

                  </div>

                </div>


              </div>
              <hr>
              <p class="text-muted" id="contentModal+`+ id +`">
              `+ Comment +`
              </p>
              <hr>
              <div>

              </div>
              <div>

              </div>
              <div class="d-flex justify-content-around">
                <div>
                  <i class="fa fa-heart"></i>
                  Like
                </div>
                <div>
                  <i class="fa fa-comment"></i>
                  Comments
                </div>

              </div>
              <textarea id="cmtInput`+ id +`" name="cmt-input" placeholder="Bình luận của bạn."
                class="inputCmt"></textarea>
              <button class="btnCmt" data-name="cmtBox+`+ id +` ">Đăng</button>
              <div id="cmtBox`+ id +`"></div>


        
            `
            const list = document.getElementById('list-feed')
            list.insertBefore(div, list.childNodes[0])
          }
        }
      );
    }
  });

  $("#btnEdit").click(function () {
    // console.log("abc");
    // console.log("abc", id);
    if ($("#textareaEdit").val().trim() !== "") {
      $.post(
        "/edit/" + id,
        { content: $("#textareaEdit").val() },
        function (data) {


          if (data.result == 0) {
            alert("Add unsuccess");
          }
          else {
            const tmp = document.getElementById("contentModal+" + id);
            // console.log($("#textareaEdit").val());
            // console.log(tmp);
            tmp.innerHTML = $("#textareaEdit").val();
          }
          $("#textareaEdit").val("");
        }
      );
    }
  });

  getNew();

  let socket = io();
  socket.on("connect", () => { });
  socket.on("disconnect", () => { });

  socket.on("haveNewInform", (h) => {
    if (h == "ok") {
      getNew();
    }
  });
});


$(document).ready(function () {
  $("#btnPostNews").click(function () {
    // console.log($('#titlePostNews').val());
    // console.log($('#ContentPostnews').val());
    if(
      $("#titlePostNews").val().trim() !== "" &&
      $("#ContentPostnews").val().trim() !== ""
    ) {
      $.post(
        "/addNews",
        {
          title: $("#titlePostNews").val(),
          content: $("#ContentPostnews").val(),
        },
        function (data) {

         }
      );
    }
  });



  $('.btnCmt').live("click",function (event) {
    console.log("12345");
    const idFeed = event.target.getAttribute('data-name').split("+").splice(-1)[0].trim();

    const comment = document.getElementById("cmtInput" + idFeed).value.trim()

    if (comment != "") {
      $.post('/cmt', { content: comment, postID: idFeed }, function (data) {
        document.getElementById("cmtInput" + idFeed).value = ""

        console.log(data)
        if (data.result == 0) {
          alert("Add unsuccess")
        }
        else {
          // console.log(data.newFeed);
          var Name = data.user.name;
          var authId = data.user.authId;
          var Comment = data.newCmt.content;
          var id = data.newCmt.feedID;
          // console.log(id);
          // console.log(id);
          // var list = "#list-cmt+"+$('.btnCmt').attr('data-name').substr(7,)
          // console.log(list);

          $("#cmtBox" + id).append(`
          <div class="cmt">
            <h6>${Name}</h6>
              
                <a href="/deleteCmt/${data.newCmt._id}">Delete</a>
            
          <p class="cmtShow+${authId}"> ${Comment} </p>

        </div>
                `)
          console.log("!!@")

        }
      })
    }
  })



});

function thisFileUpload() {
  document.getElementById("file").click();
}

function clickEdit(abc) {
  // console.log(abc)
  // console.log(document.getElementById(abc));
  console.log(abc);
  var content = document.getElementById(abc).innerText;
  if (content) {
    document.getElementById("textareaEdit").innerHTML = content;
  }
}

function getId(abc) {
  id = abc;
}

function getNew() {
  console.log("!12121");
  fetch("http://localhost:8080/getNews")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      $("#list-inform").empty()
      data.forEach(element => {
        console.log(element)
        $("#list-inform").append(`
        <hr />
        <div class="d-flex dfkj">
          <div>
            <h5>${element.title}</h5>
            <p>${element.content}</p>
          </div>
        </div>
        `)
      });
    });
}
