import React, {useCallback, useEffect} from 'react';
import Moment from 'react-moment';
import axios from 'axios';
import $ from 'jquery';
import NoticeRemoveButtonContainer from '../../../containers/remove/NoticeRemoveButtonContainer'
import EditContainerButton from'../../../containers/notices/EditContainerButton';
import {useSelector, useDispatch} from 'react-redux';
import {changeField} from'../../../modules/noticeEdit';


import jQuery from 'jquery';


window.$ = jQuery;
window.jQuery = jQuery;


jQuery.fn.center = function () {
  this.css("position","absolute");
  this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
  return this;
}




 


  $(function(){
      $(".btn_cancle").on("click", function(){
          $(".noti_replace").css({"display":"none"});
      });
    })


  
    $(function(){
      $(".btn_notice").on("click", function(){
        $(".noti-write").show();
        $(".noti-write").center();
      })
    })

    $(function(){
      $(".btn_submit").on("click", function(){
        $(".noti_replace").show();
        $(".noti_replace").center();
        window.location.reload();
      })
    })


  $(function(){
      $(".btn_cancle-1").on("click", function(){
          $(".noti-write").css({"display":"none"});
      });
  })

  $(function(){
    $(".btn_submit-1").on("click", function(){
      $(".noti-write").css({"display":"none"});
      window.location.reload();

    });
})

$(function(){      
  window.$(".quesBt").on("click", function(){
    window.$(this).parent().parent().siblings(".noti_replace").show()
    window.$(".noti_replace").center();
})
})










const NoticeItem =({notice}) => {

  
  

  const {n_title, n_cateCode, n_date, n_content,n_image } = notice;




  const dispatch = useDispatch();

    const onChangeField = useCallback(payload => dispatch(changeField(payload)), [dispatch]);
    
    const onChangeTitle = e => {
        onChangeField({key: 'n_title', value: e.target.value});
    }

    const onChangeCate = e => {
        onChangeField({key: 'n_cateCode', value: e.target.value});
    }

    const onChangeContent = e => {
        onChangeField({key: 'n_content', value: e.target.value});
    }



    const fileSelectHandler = e =>{
      onChangeField({key: 'n_image', value: e.target.value});
      imgbbUploader(e.target.files[0]).then(resp => {
          console.log(resp.data.data.url)
        })
  }

  const imgbbUploader = ( img ) => {
      let body = new FormData()
      body.set('key', 'fc932c3718be04e605f6d38678fc9533')
      body.append('image', img)
  
      return axios({
          url: 'https://api.imgbb.com/1/upload',
          method: 'post',
          timeout: 0,
          processData: false,
          mimeType: "multipart/form-data",
          contentType: false,
          data: body
      })
  }

  const fieUploadHandler = () => {
      
  }





    return(
    <tbody>
        <tr>
          <td>
            <a href="#" className="quesBt">
              {n_title}
            </a>
          </td>
          <td>
          <Moment format="YYYY/MM/DD">
            {n_date}
          </Moment>  
          </td>
          <td>
            {n_cateCode}
          </td>
          <td className="text-r">
            <NoticeRemoveButtonContainer notice={notice} key={notice._id}/>
          </td>
      </tr>
      <div className="noti_replace">
            <div className="pop_total2">
              <div className="pop_top_total">
                  <div className="pop_profile_info">
                      <p className="noti_pro_info_name">공지사항(수정)</p>
                  </div>
              </div>
              <div>
                <p>제목 : <input type="text" className="noti_title" name="notiTitle" defaultValue={n_title} onChange={onChangeTitle}/></p>
                <p>구분 : <select name="noti_select" className="notiSelect" onChange={onChangeCate} >
                  <option defaultValue={n_cateCode}>공지</option>
                  <option value={"이벤트 진행중"}>이벤트 진행중</option>
                  <option value={"이벤트 종료"}>이벤트 종료</option>
                  <option value={"보도자료"}>보도자료</option>
                </select></p>
              </div>
              <div>
                <textarea cols="60" rows="20"
               name="notiReplaceContent" defaultValue={n_content} onChange={onChangeContent}></textarea>
              </div>
              <div>
              <input type="file"  onChange={fileSelectHandler}/>
              </div>
            </div>
          <EditContainerButton notice={notice} key={notice._id}/>
      </div>
    </tbody> 
    );
}



const NoticeList = ({notices, error, loading}) => {


  if(error) {
    return <p>에러발생이요</p>
  }
  return(
    <div className="card-body">
          
    {!loading && notices && (
        <div className="table-responsive">
           <table className="table">
          <thead className=" text-primary">
      <tr>
        <th>
          제목
        </th>
        <th>
          게시일
        </th>
        <th>
          분류
        </th>
        <th className="text-r">
          관리
        </th>
      </tr>
    </thead>
    {notices.map(notice => (
        <NoticeItem notice={notice} key = {notice._id} />
    ))}
    </table>  
    </div>
    )}
    </div>
  
  
    );


}

export default NoticeList;