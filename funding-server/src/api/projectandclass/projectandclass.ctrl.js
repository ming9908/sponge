import Joi from '@hapi/joi'
import ProjectAndClass from '../../models/ProjectAndClass';

export const checkOwnProject = (ctx, next)=>{
    const { user, pAc } = ctx.state;
    if(pAc.p_maker._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
}


export const write = async ctx => {

    const schema = Joi.object().keys({
        p_code: Joi.string(),     //프로젝트 고유 코드
        p_title: Joi.string(),    //프로젝트 제목
        p_explain: Joi.string(),  //프로젝트 설명 
        p_cate: Joi.string(),     //프로젝트 카테고리
        p_addr: Joi.string(),     //프로젝트 접근주소
        p_tag: Joi.array().items(Joi.string()),
        p_img: Joi.string(),
        p_maker : {
            u_id : Joi.string(),      //창작자 아이디
            m_name : Joi.string(),    //창작자 이름
            m_profile: Joi.string(),  //창작자 이미지
            m_intro: Joi.string(),    //창작자 소개
            m_email: Joi.string(),        // 창작자 이메일
            m_certification: Joi.boolean(),   //창작자 본인인증
            m_account: {                //창작자 계좌
                bankname: Joi.string(),       //창작자 계좌 은행
                banknum: Joi.string()         //창작자 계좌 번호
            }
        },
        
        p_startDate: Joi.date(),      //프로젝트 시작일
        p_lastDate: Joi.date(),       //프로젝트 마감일
        p_refund: Joi.string(),       //선물 환불정책
        p_video: Joi.string(),        //프로젝트 영상
        p_story: Joi.string(),        //프로젝트 설명
        p_hit: Joi.number(),          //프로젝트 조회수
        p_state: Joi.string(),        //프로젝트 허용??
        p_type: Joi.string(),      //프로젝트와 클래스 구분 "p", "c"
        p_pick: Joi.string(),

        p_project: {
            p_target: Joi.number(),       //프로젝트 목표금액
            p_present : Joi.array().items({       //프로젝트 선물
                pr_price: Joi.number(),   //선물 가격
                pr_name:  Joi.string(),    //선물 이름
                pr_gusung: Joi.array().items(Joi.string())
            })
        },
        p_class: {
            c_lesson :Joi.array().items({
                le_price: Joi.number(),   //레슨 가격
                le_name: Joi.string(),    //레슨 이름
                le_intro: Joi.string(),       //레슨 설명
                le_maxstudent: Joi.number(),  //레슨 최대인원
                le_date: Joi.date(),    //레슨 일
                le_startTime: Joi.string(),  //레슨 시작시간
                le_endTime: Joi.string()        //레슨 설명
            })   
        }
    })

    const result = schema.validate(ctx.request.body);
    if(result.error){
        console.log(result.error);
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { p_code, p_title, p_explain, p_cate, p_addr, p_tag, p_maker, p_startDate, p_lastDate, p_refund, p_video, p_story, p_hit, p_state, p_type, p_project, p_class, p_pick, p_img} = ctx.request.body;

    const pc = new ProjectAndClass({p_code, p_title, p_explain, p_cate, p_addr, p_tag, p_maker, p_startDate, p_lastDate, p_refund, p_video, p_story, p_hit, p_state, p_type, p_project, p_class, p_pick, p_img});
    
    try{
        await pc.save();
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }
};


export const list = async (ctx) => {
    const page = parseInt(ctx.query.page || '1', 10);
    try{
        const pcs = await ProjectAndClass.find().sort({_id: -1}).skip((page-1) * 10).exec();
        const projectCount = await ProjectAndClass.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(projectCount / 10));
        ctx.body = pcs.map(pc => pc.toJSON()).map(pc => ({ ... pc}));

    }catch(e){
        ctx.throw(500, e);
    }

    if( page < 1) {
        ctx.status = 400;
        return;
    }

    
};

export const listByHit = async (ctx) => {
    try{
        const pcs = await ProjectAndClass.find().sort({p_hit: -1}).limit(8).exec();
        ctx.body = pcs.map(pc => pc.toJSON()).map(pc => ({ ... pc}));

    }catch(e){
        ctx.throw(500, e);
    }
};
export const listByNew = async (ctx) => {
    try{
        const pcs = await ProjectAndClass.find().sort({_id: -1}).limit(8).exec();
        ctx.body = pcs.map(pc => pc.toJSON()).map(pc => ({ ... pc}));

    }catch(e){
        ctx.throw(500, e);
    }
};
export const listBySuc = async (ctx) => {

    var tdate = new Date();
    console.log(tdate);

    try{
        const pcs = await ProjectAndClass.find({'p_lastDate': {'$gte' : tdate}}).sort({p_lastDate: 1}).limit(8).exec();
        ctx.body = pcs.map(pc => pc.toJSON()).map(pc => ({ ... pc}));

    }catch(e){
        ctx.throw(500, e);
    }
};
export const listByJu = async (ctx) => {
    try{
        const pcs = await ProjectAndClass.find({p_pick: "Y"}).limit(8).exec();
        ctx.body = pcs.map(pc => pc.toJSON()).map(pc => ({ ... pc}));

    }catch(e){
        ctx.throw(500, e);
    }
};


export const read = async ctx => {
    const { p_addr } = ctx.params;
     try{
        const pcs = await ProjectAndClass.findOne({'p_addr': p_addr}).exec();
        var hit;
        if(pcs.p_hit != null){
            hit = pcs.p_hit  + 1;
        }else{
            hit = 1;
        }
        const i = await ProjectAndClass.findByIdAndUpdatebyPaddr(p_addr, hit).exec();
        console.log("i : " + i);
        ctx.body = pcs;
        
    }catch(e){
        ctx.throw(500, e);
    }
}

export const update = async ctx => {
    // const { p_addr } = ctx.request.body;
    // console.log(p_addr + 'ddddddddddddddddddddddddddddddd')
    // try{
    //     const pc = await ProjectAndClass.findByIdAndUpdatebyPaddr(p_addr, 10);
    //     if(!pc){
    //         ctx.status = 404;
    //         return;
    //     }
    //     ctx.body = pc;
    // }catch(e){
    //     ctx.throw(500, e);
    // }
}
export const update2 = async ctx => {
    const { _id } = ctx.params;

    const schema = Joi.object().keys({
        p_code: Joi.string().required(),     //프로젝트 고유 코드
        p_title: Joi.string().required(),    //프로젝트 제목
        p_explain: Joi.string().required(),  //프로젝트 설명 
        p_cate: Joi.string().required(),     //프로젝트 카테고리
        p_addr: Joi.string().required(),     //프로젝트 접근주소
        p_tag: Joi.array().items(Joi.string()).required(),
        p_img: Joi.string().required(),
        p_maker : {
            u_id : Joi.string().required(),      //창작자 아이디
            m_name : Joi.string().required(),    //창작자 이름
            m_profile: Joi.string().required(),  //창작자 이미지
            m_intro: Joi.string().required(),    //창작자 소개
            m_email: Joi.string().required(),        // 창작자 이메일
            m_certification: Joi.boolean().required(),   //창작자 본인인증
            m_account: {                //창작자 계좌
                bankname: Joi.string().required(),       //창작자 계좌 은행
                banknum: Joi.string().required()         //창작자 계좌 번호
            }
        },
        
        p_startDate: Joi.date().required(),      //프로젝트 시작일
        p_lastDate: Joi.date().required(),       //프로젝트 마감일
        p_refund: Joi.string().required(),       //선물 환불정책
        p_video: Joi.string().required(),        //프로젝트 영상
        p_story: Joi.string().required(),        //프로젝트 설명
        p_hit: Joi.number(),          //프로젝트 조회수
        p_state: Joi.string().required(),        //프로젝트 허용??
        p_type: Joi.string().required(),      //프로젝트와 클래스 구분 "p", "c"
        p_pick: Joi.string().required(),
        //pick 선정 "Y", "N"
        p_project: {
            p_target: Joi.number().required(),       //프로젝트 목표금액
            p_present : Joi.array().items({       //프로젝트 선물
                pr_price: Joi.number().required(),   //선물 가격
                pr_name:  Joi.string().required(),    //선물 이름
                pr_gusung: Joi.array().items(Joi.string()).required()
            })
        },
        p_class: {
            c_lesson :Joi.array().items({
                le_price: Joi.number().required(),   //레슨 가격
                le_name: Joi.string().required(),    //레슨 이름
                le_day: Joi.array().items(Joi.string()).required(),    //레슨 가능요일
                le_minstudent: Joi.number().required(),  //레슨 최소인원
                le_maxstudent: Joi.number().required(),  //레슨 최대인원
                le_intro: Joi.string().required()        //레슨 설명
            })   
        }
    })

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const pc = await ProjectAndClass.findByIdAndUpdate(_id, ctx.request.body,{
            new: true
        }).exec();
        if(!pc){
            ctx.status = 404;
            return;
        }
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }
}
export const read2 = async ctx => {
    const { p_addr } = ctx.params;
     try{
        const pcs = await ProjectAndClass.findOne({'p_addr': p_addr}).exec();
        ctx.body = pcs;
        
    }catch(e){
        ctx.throw(500, e);
    }
}

export const remove = async ctx => {
    const { _id } = ctx.params;

    try{
        await ProjectAndClass.findByIdAndRemove(_id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500, e);
    }
}

export const check = async ctx => {
    const {_id} = ctx.params;

    const schema = Joi.object().keys({
        p_state: Joi.string().required(),   
    })

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const pc = await ProjectAndClass.findByIdAndUpdate(_id, ctx.request.body,{
            new: true
        }).exec();
        if(!pc){
            ctx.status = 404;
            return;
        }
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }


}

export const check2 = async ctx => {
    const {_id} = ctx.params;

    const {p_state2} = ctx.request.body;

    const schema = Joi.object().keys({
        p_state: Joi.string().required(),   
    })


    const result = schema.validate({p_state:p_state2});
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const pc = await ProjectAndClass.findByIdAndUpdate(_id, {p_state:p_state2},{
            new: true
        }).exec();
        if(!pc){
            ctx.status = 404;
            return;
        }
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }


}

export const pick = async ctx => {
    const {_id} = ctx.params;



    const schema = Joi.object().keys({
        p_pick: Joi.string().required(),   
    })


    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const pc = await ProjectAndClass.findByIdAndUpdate(_id, ctx.request.body,{
            new: true
        }).exec();
        if(!pc){
            ctx.status = 404;
            return;
        }
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }


}


export const pick2 = async ctx => {
    const {_id} = ctx.params;

    const {p_pick2} = ctx.request.body;

    const schema = Joi.object().keys({
        p_pick: Joi.string().required(),   
    })


    const result = schema.validate({p_pick:p_pick2});
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try{
        const pc = await ProjectAndClass.findByIdAndUpdate(_id, {p_pick:p_pick2},{
            new: true
        }).exec();
        if(!pc){
            ctx.status = 404;
            return;
        }
        ctx.body = pc;
    }catch(e){
        ctx.throw(500, e);
    }


}
