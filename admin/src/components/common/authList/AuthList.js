import React from 'react';
import {useDispatch, useSelector} from 'react-redux'


const AuthItem =({auth}) => {


    const {u_id, u_username, u_profile} = auth;
      return(
        <tbody>
        <tr>
          <td>
          {u_id}
          </td>
          <td>
           {u_username}
          </td>
          <td className="text-r">
            {u_profile}
          </td>
        </tr>
      </tbody>
      );
  }




const AuthList = ({auths, error, loading}) => {
    if(error) {
      return <p>에러발생</p>
    }
    return(
        <div className="card-body">
        {!loading && auths && (
        <div className="table-responsive">
          <table className="table">
            <thead className=" text-primary">
              <th>
                아이디
              </th>
              <th>
                이름
              </th>
              <th className="text-r">
                프로필
              </th>
            </thead>
            {auths.map(auth => (
                <AuthItem auth={auth} key={auth._id}/>
                 
            ))}
          </table>
        </div>
        )}
      </div>
    
    
      );
  
  
  }
  
  export default AuthList;