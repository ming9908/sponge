import React, {useEffect} from 'react';
import Button from '../../common/Button';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {writeNotice} from '../../modules/write';

const WriteActionButtonContainer= ({history, notice}) => {
    const dispatch = useDispatch();
    const { n_title, n_content, n_cateCode, noticeError, n_like, n_image} = useSelector(({write}) => ({
        n_title: write.n_title,
        n_content: write.n_content,
        n_cateCode: write.n_cateCode,
        n_like: write.n_like,
        n_image: write.n_image,
    
        noticeError : write.noticeError
        
    }));

           


            const onPublish = () => {
                console.log("write로 이동1");
        dispatch(
            writeNotice({
                n_title,
                n_content,
                n_cateCode,
                n_like,
                n_image
            })
            )
            
        };
        console.log("write로 이동?");



    useEffect(() => {
        if(notice){
            console.log('notice 에러 전')
             history.push('/notice');
        }
        if(noticeError) {
            console.log(noticeError);
        }
    }, [history, notice, noticeError]);

    console.log("onPublish 전");
    return <Button onPublish={onPublish}/>

};

export default withRouter(WriteActionButtonContainer);