import React from 'react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';

import reducer from './reducer';

const initial_filter = {
  date1: dayjs().format('YYYY-MM-01'),
  date2: dayjs().format('YYYY-MM-DD'),
};

export default function Filter() {
  const [category, setCategory] = React.useState('');
  const [list, setList] = React.useState([]);
  const [filter, dispatch] = React.useReducer(reducer, initial_filter);

  const handleFilter = () => {
    setList([]);
    window
      .fetch(`/api/ledger/07/?option=filter`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(filter),
      })
      .then((response) => response.json())
      .then((data) => {
        setList(data);
      });
  };

  const handleExcel = () => {
    window
      .fetch(`/api/ledger/07/export`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(list),
      })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        const blob = new Blob([data]);
        const fileName =
          dayjs().format('动车组防冻排水及恢复作业记录表-YYYYMMDDHHmmss') +
          '.xlsx';
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  };

  React.useEffect(() => {
    setList([]);
    if (!category) {
      window
        .fetch(`/api/ledger/07/`, {
          method: 'PUT',
        })
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          setList(data);
        });
    } else if (category === '质检审核') {
      window
        .fetch(`/api/ledger/07/?option=review`, {
          method: 'PUT',
        })
        .then((response) => response.json())
        .then((data) => {
          setList(data);
        });
    }
  }, [category]);

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
                <li className="is-active">
                  <a aria-current="page">07.动车组防冻排水及恢复作业记录表</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <hr />

        <div className="level">
          <div className="level-left">
            <a href="#/新增" className="is-size-5">
              <FontAwesomeIcon icon={faPlus} fixedWidth />
              新增
            </a>
          </div>
          <div className="level-right">
            <div className="tabs">
              <ul>
                <li className={!category ? 'is-active' : ''}>
                  <a onClick={() => setCategory('')}>
                    <FontAwesomeIcon icon={faSearch} fixedWidth />
                    检索
                  </a>
                </li>
                <li className={category === '质检审核' ? 'is-active' : ''}>
                  <a onClick={() => setCategory('质检审核')}>质检审核</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {!category && (
        <div className="container is-fullhd">
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">起始日期</label>
                <div className="control">
                  <input
                    type="date"
                    value={filter.date1}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'date1',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">终止日期</label>
                <div className="control">
                  <input
                    type="date"
                    value={filter.date2}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'date2',
                        payload: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="level">
            <div className="level-item">
              <div className="buttons">
                <button
                  type="button"
                  className="button is-info is-outlined"
                  onClick={handleFilter}
                >
                  查询
                </button>

                <button
                  type="button"
                  className="button is-success is-outlined"
                  onClick={handleExcel}
                >
                  导出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container is-fullhd">
        <div className="box">
          <div className="table-container">
            <table className="table is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th className="has-text-right">序号</th>
                  <th>日期</th>
                  <th>车组号</th>
                  <th>股道</th>
                  <th>作业者</th>
                  <th>工长</th>
                  <th>质检员</th>
                  <th>日期</th>
                  <th>车组号</th>
                  <th>股道</th>
                  <th>作业者</th>
                  <th>工长</th>
                  <th>质检员</th>
                </tr>
              </thead>

              <tbody>
                {list.map((iter) => (
                  <tr key={iter.id}>
                    <td className="has-text-right">
                      {!iter.paishui.qc && !iter.huifu.qc && (
                        <a
                          className="has-text-info is-pulled-left"
                          href={`#/${iter.id}`}
                        >
                          <FontAwesomeIcon icon={faEdit} fixedWidth />
                        </a>
                      )}

                      {iter.id}
                    </td>
                    <td>{dayjs(iter.date1).format('YYYY-MM-DD')}</td>
                    <td>{iter.paishui.train}</td>
                    <td>{iter.paishui.rail}</td>
                    <td>{iter.paishui.operator}</td>
                    <td>{iter.paishui.leader}</td>
                    <td>
                      {!!iter.paishui.qc && iter.paishui.qc}
                      {!iter.paishui.qc && (
                        <a href={`#/${iter.id}?option=review`}>质检审核</a>
                      )}
                    </td>
                    <td>{dayjs(iter.huifu.date).format('YYYY-MM-DD')}</td>
                    <td>{iter.huifu.train}</td>
                    <td>{iter.huifu.rail}</td>
                    <td>{iter.huifu.operator}</td>
                    <td>{iter.huifu.leader}</td>
                    <td>
                      {!!iter.huifu.qc && iter.huifu.qc}
                      {!!iter.paishui.qc && !iter.huifu.qc && (
                        <a href={`#/${iter.id}?option=review`}>质检审核</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <th className="has-text-right">序号</th>
                  <th>日期</th>
                  <th>车组号</th>
                  <th>股道</th>
                  <th>作业者</th>
                  <th>工长</th>
                  <th>质检员</th>
                  <th>日期</th>
                  <th>车组号</th>
                  <th>股道</th>
                  <th>作业者</th>
                  <th>工长</th>
                  <th>质检员</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
