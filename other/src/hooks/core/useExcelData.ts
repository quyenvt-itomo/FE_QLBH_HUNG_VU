import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { exportExcel, getTemplate, importExcel } from "../../stores/excel/slice";
import { ExcelTemplateQuery, ExportOptions, ImportExcelData } from "../../models/base/excel";
import { formatPayload } from "../../utils/common";

export const useExcelData = () => {
  const dispatch = useDispatch();
  const { isCheckAdd, loading, uploadingFile, importingData, currentJobId } = useSelector(
    (state: RootState) => state.Excel,
    shallowEqual,
  );

  const getCurrentTemplate = (query: ExcelTemplateQuery) => {
    dispatch(getTemplate(query));
  };

  const importCurrentExcel = (excelData: ImportExcelData) => {
    dispatch(importExcel(excelData));
  };

  const exportCurrentExcel = (query: ExportOptions) => {
    const filters = query.filters ? formatPayload(query.filters) : undefined;
    dispatch(
      exportExcel({
        ...query,
        filters,
      }),
    );
  };

  return {
    loading,
    uploadingFile,
    importingData,
    isCheckAdd,
    currentJobId,
    exportCurrentExcel,
    getCurrentTemplate,
    importCurrentExcel,
  };
};
