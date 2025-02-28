

const LocalData = () => {
  const sampleData = [
    { id: 1, name: 'Device 1', status: 'Active' },
    { id: 2, name: 'Device 2', status: 'Inactive' },
  ];

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Local Data</h2>
      <table className="w-full mt-4 border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700">ID</th>
            <th className="p-2 border border-gray-700">Name</th>
            <th className="p-2 border border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border border-gray-700">{item.id}</td>
              <td className="p-2 border border-gray-700">{item.name}</td>
              <td className="p-2 border border-gray-700">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocalData;
