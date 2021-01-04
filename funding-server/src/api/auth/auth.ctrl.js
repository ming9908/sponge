import Joi from "@hapi/joi";
import User from "../../models/user";
import bcrypt from "bcrypt";

export const register = async (ctx) => {
  // 회원 가입
  const schema = Joi.object().keys({
    u_id: Joi.string().email().required(),
    u_password: Joi.string().min(8).max(16).required(),
    u_username: Joi.string().min(2).max(10).required(),
    u_profile: Joi.string()
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;     // 요청 자체가 잘못되었을 때(Bad Request)
    ctx.body = result.error;
    return;
  }

  const { u_id, u_username, u_password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(u_id);
    if (exists) {
      ctx.status = 409;   // u_id가 중복되어 충돌할 때(conflict)
      return;
    }
    const user = new User({
      u_id,
      u_username,
    });
    await user.setPassword(u_password);
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// Kakao 가입
export const kakao_reg = async (ctx) => {
  const { u_id, u_username, u_profile } = ctx.request.body;
  try {
    const exists = await User.findByUsername(u_id);
    if (exists) {
      ctx.status = 409;   // u_id가 중복되어 충돌할 때(conflict)
      return;
    }
    const user = new User({
      u_id,
      u_username,
      u_profile
    });
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// Naver 가입
export const naver_reg = async (ctx) => {
  const { u_id, u_username, u_profile } = ctx.request.body;
  try {
    const exists = await User.findByUsername(u_id);
    if (exists) {
      ctx.status = 409;   // u_id가 중복되어 충돌할 때(conflict)
      return;
    }
    const user = new User({
      u_id,
      u_username,
      u_profile
    });
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  // 로그인
  const { u_id, u_password } = ctx.request.body;
  
  if (!u_id || !u_password) {
    ctx.status = 401;     // 권한 없음(Unauthorized) => 인증되지 않음
    return;
  }
  try {
    const user = await User.findByUsername(u_id);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(u_password);
    if (!valid) {
      ctx.status = 401;   // 401 인증되지 않음(Unauthorized)
      return;
    }
    ctx.body = user.serialize();
  
    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 카카오 계정으로 로그인
export const kakao_login = async (ctx) => {
  const { u_id } = ctx.request.body;
  
  if (!u_id) {
    ctx.status = 401;     // 권한 없음(Unauthorized) => 인증되지 않음
    return;
  }
  try {
    const user = await User.findByUsername(u_id);
    if (!user) {
      ctx.status = 401;
      return;
    }
  
    ctx.body = user.serialize();
  
    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
});
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const naver_login = async (ctx) => {
  const { u_id } = ctx.request.body;
  
  if (!u_id) {
    ctx.status = 401;     // 권한 없음(Unauthorized) => 인증되지 않음
    return;
  }
  try {
    const user = await User.findByUsername(u_id);
    if (!user) {
      ctx.status = 401;
      return;
    }
  
    ctx.body = user.serialize();
  
    const token = user.generateToken();
    ctx.cookies.set("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
});
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 로그인 상태 확인
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

// 로그아웃
export const logout = async (ctx) => {
  ctx.cookies.set("access_token");
  ctx.status = 204;     // 성공적을 처리했지만 컨텐츠 제공X (No Content)
};

// 정보 수정
export const updateInfo = async (ctx) => {
  
  // 현재 로그인 되어있는 user를 가져옴
  const { user } = ctx.state;
  if(!user) {
    ctx.status = 401;     // 401 : 권한 없음 (Unauthorized)
    return;
  }
  // ctx.body = user;

  // user가 존재한다면 user의 u_id를 가져와서 u_id가 같은 데이터를 db에서 찾음
  const u_id = user.u_id
  try {
    const userInfo = await User.findByUsername(u_id);
    if (!userInfo) {
      ctx.status = 404;   // 404 : 찾을 수 없음 (Not Found)
      return;
    }
    const { u_password, u_username, u_profile } = ctx.request.body;

    const hash = await bcrypt.hash(u_password, 10);

    const updateUser = await User.updateOne({u_id: u_id}, {$set: {hashedPassword: hash, u_username: u_username, u_profile: u_profile}}, {upsert: true});

    ctx.body = updateUser;

  }catch(e) {
    ctx.throw(500, e);
  }
};

// 사용자 정보 리스트 출력
export const userList = async (ctx) => {
  const { list } = ctx.state;  

    try {
        const users = await User.find(list);
        ctx.body = users
        .map((user) => user.toJSON())
        .map((user) => ({
            ...user,
            body: user.body
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
};