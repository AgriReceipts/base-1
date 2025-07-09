import api from './axiosInstance';

export const downloadDistrictReport = async (year: string) => {
  const res = await api.get(`reports/district`, {
    params: {year},
    responseType: 'blob',
  });

  const blob = new Blob([res.data], {type: res.headers['content-type']});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `district_report_${year}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
