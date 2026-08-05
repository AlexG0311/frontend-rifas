import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Ganadores | Admin"
        description="Listado de ganadores de rifas con información de cliente, rifa, estado de entrega y fecha de confirmación"
      />
      <PageBreadcrumb pageTitle="Ganadores" />
      <div className="space-y-6">
        <ComponentCard title="Listado de Ganadores">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
