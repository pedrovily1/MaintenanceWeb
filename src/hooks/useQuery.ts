const MOCK_DATA: Record<string, any[]> = {
  Asset: [
    {
      id: "1",
      name: "HVAC Unit 01",
      status: "Operational",
      manufacturer: "Carrier",
      imageUrl: "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-2.svg",
    },
    {
      id: "2",
      name: "Backup Generator",
      status: "Maintenance",
      manufacturer: "Cummins",
    },
    {
      id: "3",
      name: "Elevator A",
      status: "Operational",
      manufacturer: "Otis",
    },
  ],
  Request: [
    {
      id: "1",
      title: "Broken Light Fixture",
      locationName: "Office 101",
      requestNumber: "REQ-001",
      priority: "Medium",
      status: "Done",
      dueDate: "2024-03-20",
      description: "The light fixture in the main office is flickering.",
    },
    {
      id: "2",
      title: "Leaking Pipe",
      locationName: "Kitchen",
      requestNumber: "REQ-002",
      priority: "High",
      status: "Rejected",
      dueDate: "2024-03-21",
      description: "Pipe under the sink is leaking significantly.",
    },
  ],
};

export const useQuery = (modelName: string, optionsOrId: any) => {
  const data = MOCK_DATA[modelName] || [];

  if (typeof optionsOrId === "string" && optionsOrId !== "") {
    return {
      data: data.find((item) => item.id === optionsOrId) || null,
      isPending: false,
      error: null,
    };
  }

  return {
    data: data,
    isPending: false,
    error: null,
  };
};
