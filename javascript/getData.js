async function getData() {
    const url = "./data/releases.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const { createApp, ref, computed, reactive, onMounted, onUnmounted, watch, nextTick } = Vue;

        const ARTIST_COLORS = {
            PAULI: {
                bg: "linear-gradient(90deg, #ff006e, #ff4d8d, #f72585, #b5179e, #ff006e)",
                accent: "#ff006e",
            },
            "We Used To See The Sky": {
                bg: "linear-gradient(90deg, #0077b6, #00b4d8, #48cae4, #90e0ef, #0077b6)",
                accent: "#00b4d8",
            },
            Pengamax: {
                bg: "linear-gradient(90deg, #007f5f, #2d6a4f, #52b788, #95d5b2, #007f5f)",
                accent: "#52b788",
            },
            "Don Pablo": {
                bg: "linear-gradient(90deg, #ffbe0b, #fb5607, #ff9500, #ffbe0b)",
                accent: "#ffbe0b",
            },
        };

        const FALLBACK_PALETTE = [
            { bg: "linear-gradient(90deg, #06d6a0, #118ab2, #48cae4, #06d6a0)", accent: "#06d6a0" },
            { bg: "linear-gradient(90deg, #ef476f, #ffd166, #f72585, #ef476f)", accent: "#ef476f" },
            { bg: "linear-gradient(90deg, #7209b7, #f72585, #b5179e, #7209b7)", accent: "#7209b7" },
            { bg: "linear-gradient(90deg, #52b788, #40916c, #90e0ef, #52b788)", accent: "#52b788" },
        ];

        createApp({
            setup() {
                const releases = ref(json);
                const selectedArtist = ref("All");
                const isFilterOpen = ref(false);
                const artistFilter = ref(null);
                const scrollProgress = reactive({});
                const coverReveal = reactive({});
                const linksReveal = reactive({});
                const contentOffset = reactive({});
                const loadedCovers = reactive({});
                const coverImagesReady = reactive({});

                let appLoaderHidden = false;

                const artists = computed(() =>
                    [...new Set(releases.value.map((r) => r.artist))].sort()
                );

                const filteredReleases = computed(() => {
                    if (selectedArtist.value === "All") {
                        return releases.value;
                    }
                    return releases.value.filter((r) => r.artist === selectedArtist.value);
                });

                let observer = null;
                let ticking = false;

                function clamp(value, min, max) {
                    return Math.max(min, Math.min(max, value));
                }

                function isCoverImageReady(id) {
                    return !!coverImagesReady[id];
                }

                function hideAppLoader() {
                    if (appLoaderHidden) {
                        return;
                    }
                    appLoaderHidden = true;
                    const loader = document.getElementById("app-loader");
                    if (loader) {
                        loader.hidden = true;
                    }
                }

                function onCoverImageLoad(id) {
                    coverImagesReady[id] = true;
                    if (id === filteredReleases.value[0]?.id) {
                        hideAppLoader();
                    }
                }

                function verifyCachedCoverImages() {
                    document.querySelectorAll(".release-cover").forEach((img) => {
                        const section = img.closest(".release-section");
                        const id = section?.dataset.releaseId;
                        if (id && img.complete && img.naturalWidth > 0) {
                            onCoverImageLoad(id);
                        }
                    });
                }

                function resetAppLoader() {
                    appLoaderHidden = false;
                    const loader = document.getElementById("app-loader");
                    if (loader) {
                        loader.hidden = false;
                    }
                }

                function eagerLoadFirstCover() {
                    const first = filteredReleases.value[0];
                    if (first) {
                        loadedCovers[first.id] = true;
                    }
                }

                function isCoverLoaded(id) {
                    return !!loadedCovers[id];
                }

                function bgStyle(release) {
                    return { backgroundImage: `url('${release.cover}')` };
                }

                function contentStyle(id) {
                    const y = contentOffset[id] ?? 0;
                    return { transform: `translateY(${y}px)` };
                }

                function revealStyle(id, type) {
                    const opacity = type === "cover" ? (coverReveal[id] ?? 0) : (linksReveal[id] ?? 0);
                    const translateY = (1 - opacity) * (type === "cover" ? 24 : 16);

                    return {
                        opacity,
                        transform: `translateY(${translateY}px)`,
                    };
                }

                function updateScrollProgress() {
                    const viewportHeight = window.innerHeight;

                    document.querySelectorAll(".release-section").forEach((section, index) => {
                        const id = section.dataset.releaseId;
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;
                        const scrollRange = sectionHeight - viewportHeight;

                        if (scrollRange <= 0) {
                            scrollProgress[id] = 1;
                            contentOffset[id] = 0;
                            coverReveal[id] = 1;
                            linksReveal[id] = 1;
                            return;
                        }

                        const progress = clamp(
                            (window.scrollY - sectionTop) / scrollRange,
                            0,
                            1
                        );

                        scrollProgress[id] = progress;

                        const startOffset = viewportHeight * 0.48;
                        const endOffset = viewportHeight * -0.3;

                        if (index === 0 && window.scrollY < sectionTop + sectionHeight) {
                            contentOffset[id] = 0;
                            coverReveal[id] = 1;
                            linksReveal[id] = 1;
                            return;
                        }

                        contentOffset[id] = startOffset + progress * (endOffset - startOffset);
                    });

                    requestAnimationFrame(measureCoverReveal);
                    ticking = false;
                }

                function measureCoverReveal() {
                    const viewportHeight = window.innerHeight;
                    const triggerY = viewportHeight * 0.5;
                    const revealRange = viewportHeight * 0.2;

                    document.querySelectorAll(".release-section").forEach((section, index) => {
                        const id = section.dataset.releaseId;
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;

                        if (index === 0 && window.scrollY < sectionTop + sectionHeight) {
                            coverReveal[id] = 1;
                            linksReveal[id] = 1;
                            return;
                        }

                        const artistEl = section.querySelector(".release-artist");
                        if (!artistEl) {
                            return;
                        }

                        const artistMidY =
                            artistEl.getBoundingClientRect().top + artistEl.offsetHeight / 2;

                        if (artistMidY > triggerY) {
                            coverReveal[id] = 0;
                            linksReveal[id] = 0;
                        } else {
                            coverReveal[id] = clamp((triggerY - artistMidY) / revealRange, 0, 1);
                            linksReveal[id] = clamp((coverReveal[id] - 0.2) / 0.8, 0, 1);
                        }
                    });
                }

                function onScroll() {
                    if (!ticking) {
                        ticking = true;
                        requestAnimationFrame(updateScrollProgress);
                    }
                }

                function setupLazyLoader() {
                    if (observer) {
                        observer.disconnect();
                    }

                    Object.keys(loadedCovers).forEach((key) => {
                        delete loadedCovers[key];
                    });

                    observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    const id = entry.target.dataset.releaseId;
                                    loadedCovers[id] = true;
                                    observer.unobserve(entry.target);
                                }
                            });
                        },
                        { rootMargin: "100% 0px" }
                    );

                    document.querySelectorAll(".release-section").forEach((section) => {
                        observer.observe(section);
                    });
                }

                function scrollToTop() {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }

                function artistColor(artist) {
                    if (ARTIST_COLORS[artist]) {
                        return ARTIST_COLORS[artist];
                    }

                    let hash = 0;
                    for (let i = 0; i < artist.length; i++) {
                        hash = artist.charCodeAt(i) + ((hash << 5) - hash);
                    }

                    return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
                }

                function artistOptionStyle(artist) {
                    return { "--artist-gradient": artistColor(artist).bg };
                }

                const filterLabel = computed(() =>
                    selectedArtist.value === "All" ? "All artists" : selectedArtist.value
                );

                const filterTriggerClass = computed(() =>
                    selectedArtist.value === "All"
                        ? "artist-filter__trigger--all"
                        : "artist-filter__trigger--artist"
                );

                const filterTriggerStyle = computed(() => {
                    if (selectedArtist.value === "All") {
                        return null;
                    }

                    const { bg, accent } = artistColor(selectedArtist.value);
                    return {
                        "--artist-gradient": bg,
                        boxShadow: `0 4px 20px ${accent}66, 0 4px 16px rgba(0, 0, 0, 0.35)`,
                    };
                });

                function toggleFilter() {
                    isFilterOpen.value = !isFilterOpen.value;
                }

                function selectArtist(artist) {
                    selectedArtist.value = artist;
                    isFilterOpen.value = false;
                }

                function onDocumentClick(event) {
                    if (!artistFilter.value?.contains(event.target)) {
                        isFilterOpen.value = false;
                    }
                }

                function onDocumentKeydown(event) {
                    if (event.key === "Escape") {
                        isFilterOpen.value = false;
                    }
                }

                onMounted(() => {
                    document.addEventListener("click", onDocumentClick);
                    document.addEventListener("keydown", onDocumentKeydown);
                    window.addEventListener("scroll", onScroll, { passive: true });
                    nextTick(() => {
                        setupLazyLoader();
                        eagerLoadFirstCover();
                        updateScrollProgress();
                        nextTick(() => {
                            verifyCachedCoverImages();
                            setTimeout(hideAppLoader, 8000);
                        });
                    });
                });

                onUnmounted(() => {
                    document.removeEventListener("click", onDocumentClick);
                    document.removeEventListener("keydown", onDocumentKeydown);
                    window.removeEventListener("scroll", onScroll);
                    if (observer) {
                        observer.disconnect();
                    }
                });

                watch(selectedArtist, () => {
                    window.scrollTo({ top: 0 });
                    Object.keys(scrollProgress).forEach((key) => {
                        delete scrollProgress[key];
                    });
                    Object.keys(coverReveal).forEach((key) => {
                        delete coverReveal[key];
                    });
                    Object.keys(linksReveal).forEach((key) => {
                        delete linksReveal[key];
                    });
                    Object.keys(contentOffset).forEach((key) => {
                        delete contentOffset[key];
                    });
                    Object.keys(coverImagesReady).forEach((key) => {
                        delete coverImagesReady[key];
                    });
                    resetAppLoader();
                    nextTick(() => {
                        setupLazyLoader();
                        eagerLoadFirstCover();
                        updateScrollProgress();
                        nextTick(verifyCachedCoverImages);
                    });
                });

                return {
                    releases,
                    selectedArtist,
                    isFilterOpen,
                    artistFilter,
                    artists,
                    filteredReleases,
                    filterLabel,
                    filterTriggerClass,
                    filterTriggerStyle,
                    artistOptionStyle,
                    toggleFilter,
                    selectArtist,
                    isCoverLoaded,
                    isCoverImageReady,
                    onCoverImageLoad,
                    bgStyle,
                    contentStyle,
                    revealStyle,
                    scrollToTop,
                };
            },
        }).mount("#app");
    } catch (error) {
        console.error(error.message);
        const loader = document.getElementById("app-loader");
        if (loader) {
            loader.hidden = true;
        }
    }
}

getData();
