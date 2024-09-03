document.addEventListener("DOMContentLoaded", () => {
  const envForm = document.getElementById("env-form");
  const featureOptions = document.getElementById("feature-options");
  const prodOptions = document.getElementById("prod-options");
  const portalBtn = document.getElementById("portal-btn");
  const newShopBtn = document.getElementById("new-shop-btn");
  const oldShopBtn = document.getElementById("old-shop-btn");
  const marketingJobsBtn = document.getElementById("marketing-jobs-btn");
  const idInput = document.getElementById("feature-id");
  const storeInput = document.getElementById("store-id");
  const resetCacheBtn = document.getElementById("reset-cache");

  const innerTest1Btn = document.getElementById("innertest1-btn");
  const innerTest2Btn = document.getElementById("innertest2-btn");

  const getServerUrl = (env, project = null, featureId = null) => {
    if (env == "teste") {
      return "https://teste.sweed.app/api/";
    } else if (env == "dev") {
      return "https://dev.sweed.app/api/";
    } else if (env == "demo") {
      return "https://demo.sweed.app/api/";
    } else if (env == "feature") {
      return `https://feature-${project}-${featureId}.sweed.app/api/`;
    } else {
      showErrorBanner();
    }
  };

  const showSuccessBanner = () => {
    var banner = document.getElementById("banner");
    banner.classList.remove("d-none"); // Show the banner

    setTimeout(function () {
      banner.classList.add("d-none"); // Hide the banner after 2 seconds
    }, 2000);
  };

  const showErrorBanner = () => {
    var banner = document.getElementById("banner-error");
    banner.classList.remove("d-none"); // Show the banner

    setTimeout(function () {
      banner.classList.add("d-none"); // Hide the banner after 2 seconds
    }, 2000);
  };

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
            prodOptions.style.display = "block";
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

  marketingJobsBtn.addEventListener("click", () => {
    const env = getSelectedEnvironment();
    openTab(
      `http://marketing-automation.${project}-${id}.svc.cluster.local:5005/jobs/recurring?from=0&count=5000`
    );
  });

  innerTest1Btn.addEventListener("click", () => {
    openTab(`https://inner-test.sweed.app/`);
  });

  innerTest2Btn.addEventListener("click", () => {
    openTab(`https://inner-test2.sweed.app/`);
  });

  resetCacheBtn.addEventListener("click", () => {
    const { project, id, storeId } = getParams();
    const env = getSelectedEnvironment();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: "01A76CBF-921D-4AAA-8FAB-A01B4B0AC462",
      name: "consumer.catalog.product.list",
      params: {
        page: 1,
        pageSize: 1,
        storeId: storeId,
        reload: true,
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(getServerUrl(env, project, id), requestOptions)
      .then((response) => response.text())
      .then((result) => showSuccessBanner())
      .catch((error) => showErrorBanner());
  });

  restoreState();
});
