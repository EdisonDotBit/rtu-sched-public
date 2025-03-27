export const processAppointmentsByUserType = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const userType = curr.apttype || "Unknown";

              let officeGroup = acc.find((item) => item.officeName === officeName);
              if (!officeGroup) {
                  officeGroup = { officeName, users: [] };
                  acc.push(officeGroup);
              }

              const existingUser = officeGroup.users.find(
                  (u) => u.userType === userType
              );
              if (existingUser) {
                  existingUser.count += 1;
              } else {
                  officeGroup.users.push({ userType, count: 1 });
              }

              return acc;
          }, [])
        : data.reduce((acc, curr) => {
              const userType = curr.apttype || "Unknown";
              const existingUserType = acc.find(
                  (item) => item.userType === userType
              );
              if (existingUserType) {
                  existingUserType.count += 1;
              } else {
                  acc.push({ userType, count: 1 });
              }
              return acc;
          }, []);
};

export const processAppointmentsByPurpose = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const purposes = (curr.aptpurpose || "Unknown")
                  .split(", ")
                  .map((p) => p.trim());

              let officeGroup = acc.find((item) => item.officeName === officeName);
              if (!officeGroup) {
                  officeGroup = { officeName, purposes: [] };
                  acc.push(officeGroup);
              }

              purposes.forEach((purpose) => {
                  const existingPurpose = officeGroup.purposes.find(
                      (p) => p.name === purpose
                  );
                  if (existingPurpose) {
                      existingPurpose.count += 1;
                  } else {
                      officeGroup.purposes.push({ name: purpose, count: 1 });
                  }
              });

              return acc;
          }, [])
        : data.reduce((acc, curr) => {
              const purposes = (curr.aptpurpose || "Unknown")
                  .split(", ")
                  .map((p) => p.trim());

              purposes.forEach((purpose) => {
                  const existingPurpose = acc.find(
                      (item) => item.purpose === purpose
                  );
                  if (existingPurpose) {
                      existingPurpose.count += 1;
                  } else {
                      acc.push({ purpose, count: 1 });
                  }
              });

              return acc;
          }, []);
};

export const processOfficeSummaries = (data, role) => {
    return role === "superadmin"
        ? data.reduce((acc, curr) => {
              const officeName = curr.aptoffice || "Unknown Office";
              const existingOffice = acc.find(
                  (item) => item.officeName === officeName
              );

              if (existingOffice) {
                  existingOffice.totalRequests += 1;
                  existingOffice.ongoing +=
                      curr.aptstatus === "ongoing" ? 1 : 0;
                  existingOffice.confirmed +=
                      curr.aptstatus === "confirmed" ? 1 : 0;
                  existingOffice.done += curr.aptstatus === "done" ? 1 : 0;
                  existingOffice.cancelled +=
                      curr.aptstatus === "cancelled" ? 1 : 0;
              } else {
                  acc.push({
                      officeName,
                      totalRequests: 1,
                      ongoing: curr.aptstatus === "ongoing" ? 1 : 0,
                      confirmed: curr.aptstatus === "confirmed" ? 1 : 0,
                      done: curr.aptstatus === "done" ? 1 : 0,
                      cancelled: curr.aptstatus === "cancelled" ? 1 : 0,
                  });
              }

              return acc;
          }, [])
        : [
              {
                  officeName: role,
                  totalRequests: data.length,
                  ongoing: data.filter((item) => item.aptstatus === "ongoing")
                      .length,
                  confirmed: data.filter(
                      (item) => item.aptstatus === "confirmed"
                  ).length,
                  done: data.filter((item) => item.aptstatus === "done").length,
                  cancelled: data.filter(
                      (item) => item.aptstatus === "cancelled"
                  ).length,
              },
          ];
};