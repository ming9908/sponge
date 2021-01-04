
import React, {useCallback, useEffect} from 'react';
import axios from 'axios';
import WriteActionButtonContainer from '../../../containers/write/WriteActionButtonContainer'
import {changeField} from '../../../modules/write';
import {useSelector, useDispatch} from 'react-redux';
//import TestForm from '../../../components/TestForm'




const Editor = ({n_title, n_cateCode, n_content, n_image}) => {
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
        <div className="noti-write">
          <form>
          <div className="pop_total2">
            <div className="pop_top_total">
                <div className="pop_profile_info">
                    <p className="noti_pro_info_name">공지사항</p>
                </div>
            </div>
            <div>
                <p>제목 : <input type="text" className="noti_title" name="notiTitle" onChange={onChangeTitle} value={n_title} /></p>
                <p>구분 : <select className="noti_select" name="notiSelect"  onChange={onChangeCate} value={n_cateCode} >
                    <option value={"공지"}>공지</option>
                    <option value={"이벤트 진행중"}>이벤트 진행중</option>
                    <option value={"이벤트 종료"}>이벤트 종료</option>
                    <option value={"보도자료"}>보도자료</option>
                  </select>
                </p>
                <p>
              <textarea cols="60" rows="20" name="noticeCreateContent"
              onChange={onChangeContent} value={n_content}></textarea>
              <p><input type="file"  onChange={fileSelectHandler}/>
          </p>
              </p>
            </div>
          </div>
          </form>
          <WriteActionButtonContainer/>  
      </div>
    )
};

export default Editor;
