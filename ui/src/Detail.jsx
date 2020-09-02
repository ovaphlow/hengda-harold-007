import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import reducer from './reducer';
import useAuth from './useAuth';

const initial_detail = {
  date: dayjs().format('YYYY-MM-DD'),
  train: '',
  rail: '',
  operator: '',
  leader: '',
  qc: '',
  date_2: dayjs().format('YYYY-MM-DD'),
  train_2: '',
  rail_2: '',
  operator_2: '',
  leader_2: '',
  qc_2: '',
};

export default function Detail() {
  const [detail, dispatch] = React.useReducer(reducer, initial_detail);
  const { id } = useParams();
  const option = new URLSearchParams(useLocation().search).get('option');
  const auth = useAuth();

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
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        Object.keys(data.content).forEach((iter) => {
          if (iter === 'date' || iter === 'date_2') {
            dispatch({
              type: iter,
              payload: dayjs(data.content[iter]).format('YYYY-MM-DD'),
            });
          } else if (
            (iter === 'qc' && !data.content[iter]) ||
            (iter === 'qc_2' && !data.content[iter])
          ) {
            dispatch({ type: 'qc', payload: auth.name });
            dispatch({ type: 'qc_2', payload: auth.name });
          } else {
            dispatch({ type: iter, payload: data.content[iter] });
          }
        });
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
                    value={detail.date}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'date', payload: event.target.value })
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
                    value={detail.train}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'train', payload: event.target.value })
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
                    value={detail.rail}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'rail', payload: event.target.value })
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
                    value={detail.operator}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'operator',
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
                    value={detail.leader}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'leader', payload: event.target.value })
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
                    value={detail.qc}
                    disabled={!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'qc', payload: event.target.value })
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
                    value={detail.date_2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'date_2', payload: event.target.value })
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
                    value={detail.train_2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'train_2', payload: event.target.value })
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
                    value={detail.rail_2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({ type: 'rail_2', payload: event.target.value })
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
                    value={detail.operator_2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'operator_2',
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
                    value={detail.leader_2}
                    disabled={!!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'leader_2',
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
                    value={detail.qc_2}
                    disabled={!option}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'qc_2',
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
