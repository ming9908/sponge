import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../scss/style_class1.css';
import '../../App.css';
import TotalMoneyForm from './TotalMoneyForm';
import dash_dashbord2 from '../../image/dash_dashboard2.png';
import dash_manage_people1 from '../../image/dash_manage_people1.png';
import dash_manage_people2 from '../../image/dash_manage_people2.png';
import dash_money1 from '../../image/dash_money1.png';
import dash_money2 from '../../image/dash_money2.png';
import dash_page_edit1 from '../../image/dash_page_edit1.png';
import dash_page_edit2 from '../../image/dash_page_edit2.png';
import dash_advertise from '../../image/dash_advertise.png';
import dash_advertise2 from '../../image/dash_advertise2.png';
import dash_goto_detail from '../../image/dash_goto_detail.png';
import dash_goto_detail2 from '../../image/dash_goto_detail2.png';

import { XYPlot, 
        LineSeries,
        HorizontalGridLines, VerticalGridLines,
        XAxis, YAxis,
        VerticalBarSeries } from 'react-vis';

class PacDashboardForm extends Component {
    componentDidMount = () => {
    
    };
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };
    }
    
    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    render(){
        const {pac} = this.props;
        const {res} = this.props;
        if(pac){
            if(res){
            // console.log("pac : " + JSON.stringify(pac))
            var r = res;
            var price = 0;
            var people = 0;

            var dayP = res;         // 날짜별 데이터들
            var dayPrice = 0;       // 날짜별 후원액
            var dayPriceZip = [];   // 1 - 10일차 후원액 배열
            var startDate = new Date(pac.p_startDate);
            console.log(startDate.toLocaleDateString().replace(". ", "-").replace(". ", "-").replace(".", ""));

            r = res.filter(k => k.r_code === pac._id);
            for(var i =0; i< r.length; i++){
                price += r[i].r_price;
            }
            for(var w =0; w< r.length; w++){
                people++;
            }

            // // 1 - 10일차 결제금액 구하기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // for(var d = 0; d < 10; d++) {
            //     startDate = startDate.setUTCDate((startDate.getUTCDay() + d));
            //     dayP = res.filter(dr => dr.r_date.slice(0, 10) === startDate);
            //     for(var x = 0; x < dayP.length; x++) {
            //         dayPrice += dayP[x].r_price;
            //         dayPriceZip += [dayPrice];
            //     }
            //     console.log(dayPriceZip);
            // }

            // 꺾은선 그래프
            const lineGraphData = [
                {x: 0, y: 2},
                {x: 1, y: 5},
                {x: 2, y: 7},
                {x: 3, y: 9},
                {x: 4, y: 11},
                {x: 5, y: 13},
                {x: 6, y: 15}
            ];

            // 그래프 x축
            const XAxisLabel = ["1일차", "2일차", "3일차", "4일차", "5일차", "6일차", "7일차", "8일차", "9일차", "10일차"];

        return(
            <>
                <div id="wrap">
                    <div id="pro_edit">
                        <div class="edit_list">
                            <ul class="menu_list">
                                <li>
                                    <Link to={`/projectDetail/${pac.p_addr}`}>
                                        <img src={dash_goto_detail2} class="not_h" alt="페이지 수
                                        정하기" />
                                        <img src={dash_goto_detail} class="img_h" alt="페이지 수정하기" />
                                        <h4>프로젝트 페이지</h4>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/EditPage/${pac.p_addr}`}>
                                        <img src={dash_page_edit1} class="not_h" alt="페이지 수정하기" />
                                        <img src={dash_page_edit2} class="img_h" alt="페이지 수정하기" />
                                        <h4>페이지 수정하기</h4>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/buyerList/${pac.p_addr}`}>
                                        <img src={dash_manage_people1} class="not_h" alt="후원자 관리하기" />
                                        <img src={dash_manage_people2} class="img_h" alt="후원자 관리하기" />
                                        <h4>후원자 관리하기</h4>
                                    </Link>
                                </li>
                                <li>
                                    <a>
                                        <img src={dash_dashbord2} class="img_h" alt="대시보드 Beta" />
                                        <h4>대시보드 Beta</h4>
                                    </a>
                                </li>
                                <li>
                                    <a href={this.openModal} class="funding_result" onClick={this.openModal}>
                                        <img src={dash_money1} class="not_h" alt="모금액 명세 보기" />
                                        <img src={dash_money2} class="img_h" alt="모금액 명세 보기" />
                                        <h4>모금액 명세 보기</h4>
                                    </a>
                                </li>
                                <li>
                                    <Link to="/subadv">
                                        <img src={dash_advertise2} class="not_h" alt="광고 신청" />
                                        <img src={dash_advertise} class="img_h" alt="광고 신청" />
                                        <h4>광고 신청</h4>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div class="pro_manage">
                            <div class="manage_1">
                                <div class="dash_1">
                                    <div class="text_1">
                                        <h1>대시보드<span>Beta</span></h1>
                                        <h2>{pac.p_title}<span>( 창작자 : {pac.p_maker.m_name} )</span></h2>
                                        <p><span>시작일 : {pac.p_startDate.slice(0, 10)}</span> | <span>마감일 : {pac.p_lastDate.slice(0, 10)}</span></p>
                                    </div>
                                    <div class="dash_sum">
                                        <ul>
                                            <li>
                                                <h3 class="sum_title">총 후원금액</h3>
                                                <p class="sum_per">{price.toLocaleString()}원</p>
                                            </li>
                                            <li>
                                                <h3 class="sum_title">달성률</h3>
                                                <p class="sum_per">{ Math.floor((price / pac.p_project.p_target) * 100) }%</p>
                                            </li>
                                            <li>
                                                <h3 class="sum_title">남은 기간</h3>
                                                <p class="sum_per">{ (new Date(pac.p_lastDate) - new Date(pac.p_startDate)) / (1000 * 3600 * 24)}일</p>
                                            </li>
                                            <li>
                                                <h3 class="sum_title">전체 방문 수</h3>
                                                <p class="sum_per">{pac.p_hit}</p>
                                            </li>
                                            <li>
                                                <h3 class="sum_title">후원 횟수</h3>
                                                <p class="sum_per">{people}</p>
                                            </li>
                                            <li>
                                                <h3 class="sum_title">후원 전환률</h3>
                                                <p class="sum_per">{ Math.round((people) / (pac.p_hit) * 100)}%</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="dash_2">
                                    <div class="dash2_content">
                                        <h2>일일 누적 후원액</h2>
                                        <div class="dash2_graph">
                                            <h4 class="graph2_line">일일 누적 후원액 꺾은선 그래프</h4>
                                            <XYPlot width={950} height={400}>
                                                <LineSeries
                                                    data={lineGraphData}
                                                    strokeStyle={"solid"}
                                                    strokeWidth={2}
                                                    stroke={"#B322F8"}
                                                    curve={'curveMonotoneY'}
                                                    getNull={(d) => d.y !== null}
                                                />
                                                {/* <HorizontalGridLines /> */}
                                                <VerticalGridLines innerWidth={20}/>
                                                <XAxis tickTotal={7} tickFormat={(value) => (XAxisLabel[value])} title="날짜" />
                                                <YAxis tickTotal={5} title={"후원액 (단위: 만원)"} />
                                            </XYPlot>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TotalMoneyForm isOpen={this.state.isModalOpen} close={this.closeModal} pac={pac} res={res} />
            </>
        );
            }else {
                return(
                    <>
                        <div>실패</div>
                    </>
                )
            }
        }else {
            return(
                <div>실패</div>
            )
        }
    };
};

export default PacDashboardForm;