import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import reducer from './reducer';
import useAuth from './useAuth';

const initial_detail = {
  date1: dayjs().format('YYYY-MM-DD'),
  train1: '',
  rail1: '',
  operator1: '',
  leader1: '',
  qc1: '',
  date2: dayjs().format('YYYY-MM-DD'),
  train2: '',
  rail2: '',
  operator2: '',
  leader2: '',
  qc2: '',
};

export default function Detail() {
  const [detail, dispatch] = React.useReducer(reducer, initial_detail);
  const { id } = useParams();
  const option = new URLSearchParams(useLocation().search).get('option');
  const auth = useAuth() || {};

  const handleSave = () => {
    window
      .fetch(`/api/ledger/07/`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(detail),
      })
      .then((response) => {
        if (response.status === 200) window.history.go(-1);
        else window.alert('服务器错误');
      });
  };

  const handleUpdate = () => {
    window
      .fetch(`/api/ledger/07/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(detail),
      })
      .then((response) => {
        if (response.status === 200) window.history.go(-1);
        else window.alert('服务器错误');
      });
  };

  const handleRemove = () => {
    if (!window.confirm('确定要删除当前数据？')) return;
    window
      .fetch(`/api/ledger/07/${id}`, {
        method: 'DELETE',
      })
      .then((response) => {
        if (response.status === 200) window.history.go(-1);
        else window.alert('服务器错误');
      });
  };

  React.useEffect(() => {
    if (!id) return;
    if (!!option && !auth) {
      window.alert('当前用户没有对应的权限');
      window.history.go(-1);
    }
    window
      .fetch(`/api/ledger/07/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'date1', payload: dayjs(data.date1).format('YYYY-MM-DD') });
        dispatch({ type: 'train1', payload: data.paishui.train });
        dispatch({ type: 'rail1', payload: data.paishui.rail });
        dispatch({ type: 'operator1', payload: data.paishui.operator });
        dispatch({ type: 'leader1', payload: data.paishui.leader });
        if (!data.paishui.qc && !!option) {
          dispatch({ type: 'qc1', payload: auth.name });
        } else {
          dispatch({ type: 'qc1', payload: data.paishui.qc });
        }
        dispatch({ type: 'date2', payload: dayjs(data.date2).format('YYYY-MM-DD') });
        dispatch({ type: 'train2', payload: data.huifu.train });
        dispatch({ type: 'rail2', payload: data.huifu.rail });
        dispatch({ type: 'operator2', payload: data.huifu.operator });
        dispatch({ type: 'leader2', payload: data.huifu.leader });
        if (!!data.paishui.qc && !data.huifu.qc && !!option) {
          dispatch({ type: 'qc2', payload: auth.name });
        } else {
          dispatch({ type: 'qc2', payload: data.huifu.qc });
        }
      });
  }, []);

  return (
    <>
      <section className="page-title">
        <div className="level">
          <div className="level-left">
            <h1 className="title">07.动车组防冻排水及恢复作业记录表</h1>
          </div>
          <div className="level-right">
            <nav className="breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li>
                  <a href="/">首页</a>
                </li>
                <li>
                  <a href="#/">07.动车组防冻排水及恢复作业记录表</a>
                </li>
                <li className="is-active">
                  <a aria-current="page">{!!id ? id : '新增'}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <hr />
      </section>

      <div className="container is-fullhd">
        <div className="box">
          <h2 className="title is-4 has-text-info">排水作业</h2>
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="field">
                <label className="label">日期</label>
                <div className="control">
                  <input
                    type="date"
                    value={detail.date1}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'date1', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">车组</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.train1}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'train1', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">股道</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.rail1}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'rail1', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">作业者</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.operator1}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'operator1',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">工长</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.leader1}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'leader1', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">质检员</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.qc1}
                    disabled={!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'qc1', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="title has-text-success is-4">恢复作业</h2>

          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="field">
                <label className="label">日期</label>
                <div className="control">
                  <input
                    type="date"
                    value={detail.date2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'date2', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">车组</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.train2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'train2', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">股道</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.rail2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'rail2', payload: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">作业者</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.operator2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'operator2',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">工长</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.leader2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'leader2',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <label className="label">质检员</label>
                <div className="control">
                  <input
                    type="text"
                    value={detail.qc2}
                    disabled={!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'qc2',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="level">
            <div className="level-left">
              <button
                type="button"
                className="button is-light"
                onClick={() => window.history.go(-1)}
              >
                后退
              </button>
            </div>

            <div className="level-right">
              <div className="buttons">
                {!!id && (
                  <button
                    type="button"
                    className="button is-danger is-outlined"
                    onClick={handleRemove}
                  >
                    删除
                  </button>
                )}

                <button
                  type="button"
                  className="button is-primary"
                  onClick={!id ? handleSave : handleUpdate}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
