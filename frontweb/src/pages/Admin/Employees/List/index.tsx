import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from "util/auth";
import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';

import './styles.css';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
    });
  };

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 3,
      },
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  return (
    <>
      {
        hasAnyRoles(['ROLE_ADMIN']) && (
          <Link to="/admin/employees/create">
            <button className="btn btn-primary text-white btn-crud-add">
              ADICIONAR
            </button>
          </Link>
        )
      }

      {page?.content.map((employee) => (
        <div key={employee.id}>
          <EmployeeCard employee={employee} />
        </div>
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
