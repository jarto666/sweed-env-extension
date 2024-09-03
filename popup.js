document.addEventListener("DOMContentLoaded", () => {
  const envForm = document.getElementById("env-form");
  const featureOptions = document.getElementById("feature-options");
  const prodOptions = document.getElementById("prod-options");
  const portalBtn = document.getElementById("portal-btn");
  const newShopBtn = document.getElementById("new-shop-btn");
  const oldShopBtn = document.getElementById("old-shop-btn");
  // const marketingJobsBtn = document.getElementById("marketing-jobs-btn");
  const idInput = document.getElementById("feature-id");
  const storeInput = document.getElementById("store-id");

  const innerTest1Btn = document.getElementById("innertest1-btn");
  const innerTest2Btn = document.getElementById("innertest2-btn");

  const saveState = () => {
    if (!chrome.storage) {
      return;
    }

    const state = {
      environment: envForm.environment.value,
      project: envForm.project ? envForm.project.value : null,
      id: idInput.value,
      storeId: storeInput.value,
    };
    chrome.storage.local.set({ state });
  };

  const restoreState = () => {
    if (!chrome.storage) {
      document.querySelector(
        `input[name="environment"][value="dev"]`
      ).checked = true;
      storeInput.value = "63";
      return;
    }

    chrome.storage?.local.get("state", (data) => {
      if (data.state) {
        if (data.state.environment) {
          document.querySelector(
            `input[name="environment"][value="${data.state.environment}"]`
          ).checked = true;
          if (data.state.environment === "feature") {
            featureOptions.style.display = "block";
          } else if (data.state.environment === "prod") {
            prodOptions.style.display = "contents";
          }
        }
        if (data.state.project) {
          document.querySelector(
            `input[name="project"][value="${data.state.project}"]`
          ).checked = true;
        }
        if (data.state.id) {
          idInput.value = data.state.id;
        }
        if (data.state.storeId) {
          storeInput.value = data.state.storeId;
        }
      } else {
        document.querySelector(
          `input[name="environment"][value="dev"]`
        ).checked = true;
        storeInput.value = "63";
      }
    });
  };

  document.querySelectorAll('input[name="environment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      featureOptions.style.display =
        radio.value === "feature" ? "block" : "none";

      prodOptions.style.display = radio.value === "prod" ? "contents" : "none";

      saveState();
    });
  });

  document.querySelectorAll('input[name="project"]').forEach((radio) => {
    radio.addEventListener("change", saveState);
  });

  idInput.addEventListener("input", saveState);
  storeInput.addEventListener("input", saveState);

  const openTab = (url) => {
    console.log(url);
    chrome.tabs.create({ url });
  };

  const getSelectedEnvironment = () => {
    return envForm.environment.value;
  };

  const getParams = () => {
    return {
      project: envForm.project ? envForm.project.value : null,
      id: idInput.value,
      storeId: storeInput.value,
    };
  };

  portalBtn.addEventListener("click", () => {
    const env = getSelectedEnvironment();
    const { project, id } = getParams();
    if (env === "feature") {
      openTab(`https://${env}-${project}-${id}.sweedpos.com`);
    } else if (env === "prod") {
      openTab(`https://store.sweedpos.com`);
    } else {
      openTab(`https://${env}.sweedpos.com`);
    }
  });

  newShopBtn.addEventListener("click", () => {
    const env = getSelectedEnvironment();
    const { project, id, storeId } = getParams();
    if (!storeId) storeId = 63;
    if (env === "feature") {
      openTab(
        `https://web-ui-${env}-${project}-${id}.sweedpos.com/s${storeId}`
      );
    } else if (env === "prod") {
      openTab(`https://web-ui-production.sweedpos.com/s${storeId}`);
    } else {
      openTab(`https://web-ui-${env}.sweedpos.com/s${storeId}`);
    }
  });

  oldShopBtn.addEventListener("click", () => {
    const env = getSelectedEnvironment();
    const { project, id, storeId } = getParams();
    if (!storeId) storeId = 63;
    if (env === "feature") {
      openTab(`https://${env}-${project}-${id}.sweed.app?sid=${storeId}`);
    } else if (env === "prod") {
      openTab(`https://sweed.app/?sid=${storeId}`);
    } else {
      openTab(`https://${env}.sweed.app?sid=${storeId}`);
    }
  });

  // marketingJobsBtn.addEventListener("click", () => {
  //   const env = getSelectedEnvironment();
  //   openTab(
  //     `http://marketing-automation.${project}-${id}.svc.cluster.local:5005/jobs/recurring?from=0&count=5000`
  //   );
  // });

  innerTest1Btn.addEventListener("click", () => {
    openTab(`https://inner-test.sweed.app/`);
  });

  innerTest2Btn.addEventListener("click", () => {
    openTab(`https://inner-test2.sweed.app/`);
  });

  restoreState();
});
