import { Sidebar } from "flowbite-react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiChartPie, HiUsers } from "react-icons/hi";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              as={Link} // Use Link instead of 'a' tag
              to="/"
              icon={HiChartPie}
              className={
                "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
              }
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              as={Link}
              to="/users/list"
              icon={HiUsers}
              className={
                "/users/list" === currentPage
                  ? "bg-gray-100 dark:bg-gray-700"
                  : ""
              }
            >
              Users list
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
