import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import '../../scss/style_fundding.css';
import BuyerDataForm from './BuyerDataForm';

// $ = jQuery;
// window.jQuery = jQuery;
class BuyerListForm extends Component {
    componentDidMount = () => {
    };

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            
        };
    }
    
    openModal = () => {
        console.log('openModal 호출');
        this.setState({ isModalOpen: true });

    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    render() {
        const {pac} = this.props;
        const {res} = this.props;
        if(pac){
            if(res){
                // console.log("pac : " + JSON.stringify(pac))
                var r = res;

                r = res.filter(k => k.r_code === pac._id);
                console.log(r);
    
                return(
                    <>
                        <div class="myBuyer">
                            <div class="my_buyer_top">
                                <div class="my_buyer_top2">
                                    <div class="inner_box">
                                    </div>
                                </div>        
                            </div>
                            <div class="my_buyer_bottom">
                                <div class="inner_box">
                                    <div class="buyer_bottom_total">
                                        <div class="buyer_bottom1">
                                            <p>결제가 완료된 후원자에 한해 배송 관련 개인정보를 열람하실 수 있습니다.</p>
                                        </div>  
                                        <div class="buyer_bottom2">
                                            <ul>
                                                <li class="buyer_bottom2_list">
                                                    <dl>
                                                        <dt>후원번호</dt>
                                                        <dt>이름</dt>
                                                        <dt>금액</dt>
                                                        <dt>일시</dt>
                                                        <dt>출금상태</dt>
                                                        <dt>선물실행</dt>
                                                    </dl>
                                                </li>   
                                                {r.map((buyer, i) => (
                                                    <li class="buyer_bottom2_list2">
                                                        <dl>
                                                            <dd>
                                                                { (i >= 9) ? (i + 1) : ("0" + (i + 1)) }
                                                            </dd>
                                                            <dd><input type="button" value={buyer.r_addr.ad_name} class="buyerN" onClick={this.openModal} /></dd>
                                                            <dd>{buyer.r_price}원</dd>
                                                            <dd>{buyer.r_date.slice(0, 10)} {new Date(buyer.r_date).getUTCHours()} : {"0" + new Date(buyer.r_date).getUTCMinutes()}</dd>
                                                            <dd>
                                                                <span class="comple">결제완료</span>
                                                                <span class="notcomple">결제대기</span>
                                                            </dd>
                                                            <dd>실행완료</dd>
                                                        </dl>
                                                    </li>
                                                ))} 
                                                {/* map end */} 
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BuyerDataForm isOpen={this.state.isModalOpen} close={this.closeModal} pac={pac} res={res} />
                    </>  
                );
            }else {
                return(
                    <div>실패</div>
                )
            }
        }else {
            return(
                <div>실패</div>
            )
        }
    };
};

export default BuyerListForm;