import React from 'react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';

import reducer from './reducer';

const initial_filter = {
  date_begin: dayjs().format('YYYY-MM-01'),
  date_end: dayjs().format('YYYY-MM-DD'),
};

export default function Filter() {
  const [category, setCategory] = React.useState('');
  const [list, setList] = React.useState([]);
  const [filter, dispatch] = React.useReducer(reducer, initial_filter);

  const handleFilter = () => {
    setList([]);
    window
      .fetch(`/api/ledger/07/filter/`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(filter),
      })
      .then((response) => {
        if (response.status === 200) return response.json();
        else window.alert('服务器错误');
      })
      .then((data) => {
        setList(data.content);
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
        .fetch(`/api/ledger/07/`)
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          setList(data.content);
        });
    } else {
      window
        .fetch(`/api/ledger/07/review/`)
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          setList(data.content);
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
            <a
              href="#/新增"
              className="is-size-5"
            >
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
                    value={filter.date_begin}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'date_begin',
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
                    value={filter.date_end}
                    className="input"
                    onChange={(event) =>
                      dispatch({
                        type: 'date_end',
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
                      <a
                        className="has-text-info is-pulled-left"
                        href={`#/07.动车组防冻排水及恢复作业记录表/${iter.id}`}
                      >
                        <FontAwesomeIcon icon={faEdit} fixedWidth />
                      </a>

                      {iter.id}
                    </td>
                    <td>{dayjs(iter.date).format('YYYY-MM-DD')}</td>
                    <td>{iter.train}</td>
                    <td>{iter.rail}</td>
                    <td>{iter.operator}</td>
                    <td>{iter.leader}</td>
                    <td>
                      {!!iter.qc && iter.qc}
                      {!iter.qc && (
                        <a
                          href={`#/07.动车组防冻排水及恢复作业记录表/${iter.id}?option=review`}
                        >
                          质检审核
                        </a>
                      )}
                    </td>
                    <td>{dayjs(iter.date_2).format('YYYY-MM-DD')}</td>
                    <td>{iter.train_2}</td>
                    <td>{iter.rail_2}</td>
                    <td>{iter.operator_2}</td>
                    <td>{iter.leader_2}</td>
                    <td>
                      {!!iter.qc_2 && iter.qc_2}
                      {!iter.qc && (
                        <a
                          href={`#/07.动车组防冻排水及恢复作业记录表/${iter.id}?option=review`}
                        >
                          质检审核
                        </a>
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
